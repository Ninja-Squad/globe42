package org.globe42.web.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.impl.DefaultClaims;
import org.globe42.dao.UserDao;
import org.globe42.test.BaseTest;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

/**
 * Unit tests for {@link AuthenticationFilter}
 * @author JB Nizet
 */
public class AuthenticationFilterTest extends BaseTest {

    @Spy
    private CurrentUser currentUser = new CurrentUser();

    @Mock
    private JwtHelper mockJwtHelper;

    @Mock
    private UserDao mockUserDao;

    @InjectMocks
    private AuthenticationFilter filter;

    @Mock
    private FilterChain mockFilterChain;

    @Test
    public void shouldRejectIfNoHeaderAndNoCookieForApiRequest() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/persons");

        shouldRejectWithUnauthorized(request);
    }

    @Test
    public void shouldAcceptIfNoHeaderAndNoCookieForApiAuthenticationRequest() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/authentication");

        shouldAccept(request);
    }

    @Test
    public void shouldRejectIfNoHeaderAndNoCookieForActuatorRequest() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/actuator");

        shouldRejectWithUnauthorized(request);
    }

    @Test
    public void shouldAcceptIfNoHeaderAndNoCookieForActuatorHealthRequest() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/actuator/health");

        shouldAccept(request);
    }

    @Test
    public void shouldRejectIfHeaderWithNoBearerPrefix() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/persons");
        request.addHeader(HttpHeaders.AUTHORIZATION, "hello world");

        shouldRejectWithUnauthorized(request);
    }

    @Test
    public void shouldRejectIfHeaderWithBadToken() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/persons");
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        when(mockJwtHelper.extractClaims("hello")).thenThrow(new JwtException("invalid"));

        shouldRejectWithUnauthorized(request);
    }

    @Test
    public void shouldRejectIfHeaderWithTokenWithBadUserId() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/persons");
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("abcd");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);

        shouldRejectWithUnauthorized(request);
    }

    @Test
    public void shouldRejectIfUserDoesNotExist() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/persons");
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);
        when(mockUserDao.existsNotDeletedById(1234L)).thenReturn(false);

        shouldRejectWithUnauthorized(request);
    }

    @Test
    public void shouldSetCurrentUserIfValidTokenInHeader() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/persons");
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);
        when(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true);

        shouldAccept(request);
        assertThat(currentUser.getUserId()).isEqualTo(1234L);
    }

    @Test
    public void shouldSetCurrentUserIfValidTokenInCookie() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/persons");
        request.setCookies(new Cookie("globe42_token", "hello"));

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);
        when(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true);

        shouldAccept(request);
        assertThat(currentUser.getUserId()).isEqualTo(1234L);
    }

    @Test
    public void shouldRejectIfNotAdminForProtectedActuatorRequest() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/actuator/foo");
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);
        when(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true);
        when(mockUserDao.existsNotDeletedAdminById(1234L)).thenReturn(false);

        shouldRejectWithForbidden(request);
    }

    private void shouldRejectWithUnauthorized(HttpServletRequest request) throws IOException, ServletException {
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, mockFilterChain);

        verify(mockFilterChain, never()).doFilter(request, response);
        assertThat(response.getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    private void shouldRejectWithForbidden(HttpServletRequest request) throws IOException, ServletException {
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, mockFilterChain);

        verify(mockFilterChain, never()).doFilter(request, response);
        assertThat(response.getStatus()).isEqualTo(HttpStatus.FORBIDDEN.value());
    }

    private void shouldAccept(HttpServletRequest request) throws IOException, ServletException {
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, mockFilterChain);

        verify(mockFilterChain).doFilter(request, response);
    }
}
