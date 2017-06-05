package org.globe42.web.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.jsonwebtoken.Claims;
import org.globe42.web.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor used to check that the user is authenticate, on all API URLs except /api/authentication
 * @author JB Nizet
 */
public class AuthenticationInterceptor implements HandlerInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private CurrentUser currentUser;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        Long userId = extractUserIdFromToken(request);
        currentUser.setUserId(userId);
        if (userId == null) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private Long extractUserIdFromToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null) {
            return null;
        }

        if (!header.startsWith(BEARER_PREFIX)) {
            return null;
        }

        String token = header.substring(BEARER_PREFIX.length()).trim();

        try {
            Claims claims = jwtHelper.extractClaims(token);
            return Long.parseLong(claims.getSubject());
        }
        catch (Exception e) {
            throw new UnauthorizedException();
        }
    }
}
