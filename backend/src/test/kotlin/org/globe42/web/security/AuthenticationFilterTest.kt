package org.globe42.web.security

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.impl.DefaultClaims
import io.mockk.every
import io.mockk.mockk
import io.mockk.spyk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.UserDao
import org.junit.jupiter.api.Test
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
class AuthenticationFilterTest {

    private val currentUser = spyk(CurrentUser())

    private val mockJwtHelper = mockk<JwtHelper>()

    private val mockUserDao = mockk<UserDao>()

    private val filter = AuthenticationFilter(mockJwtHelper, currentUser, mockUserDao)

    private val mockFilterChain = mockk<FilterChain>(relaxUnitFun = true)

    @Test
    fun `should reject if no header and no cookie for api request`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun `should accept if no header and no cookie for api authentication request`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/authentication"

        shouldAccept(request)
    }

    @Test
    fun `should reject if no header and no cookie for actuator request`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/actuator"

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun `should accept if no header and no cookie for actuator health request`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/actuator/health"

        shouldAccept(request)
    }

    @Test
    fun `should reject if header with no bearer prefix`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "hello world")

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun `should reject if header with bad token`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        every { mockJwtHelper.extractClaims("hello") } throws JwtException("invalid")

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun `should reject if header with token with bad user id`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "abcd"
        every { mockJwtHelper.extractClaims("hello") } returns claims

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun `should reject if user does not exist`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "1234"
        every { mockJwtHelper.extractClaims("hello") } returns claims
        every { mockUserDao.existsNotDeletedById(1234L) } returns false

        shouldRejectWithUnauthorized(request)
    }

    @Test
    fun `should set current user if valid token in header`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "1234"
        every { mockJwtHelper.extractClaims("hello") } returns claims
        every { mockUserDao.existsNotDeletedById(1234L) } returns true

        shouldAccept(request)
        assertThat(currentUser.userId).isEqualTo(1234L)
    }

    @Test
    fun `should set current user if valid token in cookie`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/api/persons"
        request.setCookies(Cookie("globe42_token", "hello"))

        val claims = DefaultClaims()
        claims.subject = "1234"
        every { mockJwtHelper.extractClaims("hello") } returns claims
        every { mockUserDao.existsNotDeletedById(1234L) } returns true

        shouldAccept(request)
        assertThat(currentUser.userId).isEqualTo(1234L)
    }

    @Test
    fun `should reject if not admin for protected actuator request`() {
        val request = MockHttpServletRequest()
        request.requestURI = "/actuator/foo"
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello")

        val claims = DefaultClaims()
        claims.subject = "1234"
        every { mockJwtHelper.extractClaims("hello") } returns claims
        every { mockUserDao.existsNotDeletedById(1234L) } returns true
        every { mockUserDao.existsNotDeletedAdminById(1234L) } returns false

        shouldRejectWithForbidden(request)
    }

    private fun shouldRejectWithUnauthorized(request: HttpServletRequest) {
        val response = MockHttpServletResponse()
        filter.doFilter(request, response, mockFilterChain)

        verify(inverse = true) { mockFilterChain.doFilter(request, response) }
        assertThat(response.status).isEqualTo(HttpStatus.UNAUTHORIZED.value())
    }

    private fun shouldRejectWithForbidden(request: HttpServletRequest) {
        val response = MockHttpServletResponse()
        filter.doFilter(request, response, mockFilterChain)

        verify(inverse = true) { mockFilterChain.doFilter(request, response) }
        assertThat(response.status).isEqualTo(HttpStatus.FORBIDDEN.value())
    }

    private fun shouldAccept(request: HttpServletRequest) {
        val response = MockHttpServletResponse()
        filter.doFilter(request, response, mockFilterChain)

        verify { mockFilterChain.doFilter(request, response) }
    }
}
