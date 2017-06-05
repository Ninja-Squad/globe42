package org.globe42.web.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.impl.DefaultClaims;
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

    @InjectMocks
    private AuthenticationInterceptor interceptor;

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowIfNoHeader() {
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

    @Test
    public void shouldSetCurrentUserIfValidToken() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer hello");

        Claims claims = new DefaultClaims();
        claims.setSubject("1234");
        when(mockJwtHelper.extractClaims("hello")).thenReturn(claims);

        interceptor.preHandle(request, null, null);

        assertThat(currentUser.getUserId()).isEqualTo(1234L);
    }
}
