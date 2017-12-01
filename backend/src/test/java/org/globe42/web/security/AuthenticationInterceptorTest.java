package org.globe42.web.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import javax.servlet.http.Cookie;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.impl.DefaultClaims;
import org.globe42.dao.UserDao;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.UnauthorizedException;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;

/**
 * Unit tests for {@link AuthenticationInterceptor}
 * @author JB Nizet
 */
public class AuthenticationInterceptorTest extends BaseTest {

    @Spy
    private CurrentUser currentUser = new CurrentUser();

    @Mock
    private JwtHelper mockJwtHelper;

    @Mock
    private UserDao mockUserDao;

    @InjectMocks
    private AuthenticationInterceptor interceptor;

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowIfNoHeaderAndNoCookie() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        interceptor.preHandle(request, null, null);
    }

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowIfHeaderWithNoBearerPrefix() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "hello world");
        interceptor.preHandle(request, null, null);
    }

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowIfHeaderWithBadToken() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        when(mockJwtHelper.extractClaims("hello")).thenThrow(new JwtException("invalid"));

        interceptor.preHandle(request, null, null);
    }

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowIfHeaderWithTokenWithBadUserId() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("abcd");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);

        interceptor.preHandle(request, null, null);
    }

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowIfUserDoesNotExist() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);
        when(mockUserDao.existsNotDeletedById(1234L)).thenReturn(false);

        interceptor.preHandle(request, null, null);
    }

    @Test
    public void shouldSetCurrentUserIfValidTokenInHeader() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);
        when(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true);

        interceptor.preHandle(request, null, null);

        assertThat(currentUser.getUserId()).isEqualTo(1234L);
    }

    @Test
    public void shouldSetCurrentUserIfValidTokenInCookie() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("globe42_token", "hello"));

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);
        when(mockUserDao.existsNotDeletedById(1234L)).thenReturn(true);

        interceptor.preHandle(request, null, null);

        assertThat(currentUser.getUserId()).isEqualTo(1234L);
    }
}
