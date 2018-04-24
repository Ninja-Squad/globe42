package org.globe42.web.security

import com.nhaarman.mockito_kotlin.never
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.whenever
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.impl.DefaultClaims
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.UserDao
import org.globe42.test.BaseTest
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Spy
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import javax.servlet.FilterChain
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest

/**
 * Unit tests for [AuthenticationFilter]
 * @author JB Nizet
 */
class AuthenticationFilterTest : BaseTest() {

    @Spy
    private val currentUser = CurrentUser()

    @Mock
    private lateinit var mockJwtHelper: JwtHelper

    @Mock
    private lateinit var mockUserDao: UserDao

    @InjectMocks
    private lateinit var filter: AuthenticationFilter

    @Mock
    private lateinit var mockFilterChain: FilterChain

    @Test
    fun shouldRejectIfNoHeaderAndNoCookieForApiRequest() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun shouldAcceptIfNoHeaderAndNoCookieForApiAuthenticationRequest() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/authentication"

        shouldAccept(request)
    }

    @Test
    fun shouldRejectIfNoHeaderAndNoCookieForActuatorRequest() {
        val request = MockHttpServletRequest()
        request.requestURI = "/actuator"

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun shouldAcceptIfNoHeaderAndNoCookieForActuatorHealthRequest() {
        val request = MockHttpServletRequest()
        request.requestURI = "/actuator/health"

        shouldAccept(request)
    }

    @Test
    fun shouldRejectIfHeaderWithNoBearerPrefix() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "hello world")

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun shouldRejectIfHeaderWithBadToken() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        whenever(mockJwtHelper.extractClaims("hello")).thenThrow(JwtException("invalid"))

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun shouldRejectIfHeaderWithTokenWithBadUserId() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "abcd"
        whenever(mockJwtHelper.extractClaims("hello")).thenReturn(claims)

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun shouldRejectIfUserDoesNotExist() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "1234"
        whenever(mockJwtHelper.extractClaims("hello")).thenReturn(claims)
        whenever(mockUserDao.existsNotDeletedById(1234L)).thenReturn(false)

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun shouldSetCurrentUserIfValidTokenInHeader() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "1234"
        whenever(mockJwtHelper.extractClaims("hello")).thenReturn(claims)
        whenever(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true)

        shouldAccept(request)
        assertThat(currentUser.userId).isEqualTo(1234L)
    }

    @Test
    fun shouldSetCurrentUserIfValidTokenInCookie() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.setCookies(Cookie("globe42_token", "hello"))

        val claims = DefaultClaims()
        claims.subject = "1234"
        whenever(mockJwtHelper.extractClaims("hello")).thenReturn(claims)
        whenever(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true)

        shouldAccept(request)
        assertThat(currentUser.userId).isEqualTo(1234L)
    }

    @Test
    fun shouldRejectIfNotAdminForProtectedActuatorRequest() {
        val request = MockHttpServletRequest()
        request.requestURI = "/actuator/foo"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "1234"
        whenever(mockJwtHelper.extractClaims("hello")).thenReturn(claims)
        whenever(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true)
        whenever(mockUserDao.existsNotDeletedAdminById(1234L)).thenReturn(false)

        shouldRejectWithForbidden(request)
    }

    private fun shouldRejectWithUnauthorized(request: HttpServletRequest) {
        val response = MockHttpServletResponse()
        filter.doFilter(request, response, mockFilterChain)

        verify(mockFilterChain, never()).doFilter(request, response)
        assertThat(response.status).isEqualTo(HttpStatus.UNAUTHORIZED.value())
    }

    private fun shouldRejectWithForbidden(request: HttpServletRequest) {
        val response = MockHttpServletResponse()
        filter.doFilter(request, response, mockFilterChain)

        verify(mockFilterChain, never()).doFilter(request, response)
        assertThat(response.status).isEqualTo(HttpStatus.FORBIDDEN.value())
    }

    private fun shouldAccept(request: HttpServletRequest) {
        val response = MockHttpServletResponse()
        filter.doFilter(request, response, mockFilterChain)

        verify(mockFilterChain).doFilter(request, response)
    }
}
