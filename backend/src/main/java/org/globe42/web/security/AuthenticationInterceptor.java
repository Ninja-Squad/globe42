package org.globe42.web.security;

import java.util.Arrays;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.jsonwebtoken.Claims;
import org.globe42.dao.UserDao;
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

    @Autowired
    private UserDao userDao;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        Long userId = extractUserIdFromToken(request);
        currentUser.setUserId(userId);
        if (userId == null || !userDao.existsNotDeletedById(userId)) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private Long extractUserIdFromToken(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return null;
        }

        try {
            Claims claims = jwtHelper.extractClaims(token);
            return Long.parseLong(claims.getSubject());
        }
        catch (Exception e) {
            throw new UnauthorizedException();
        }
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null) {
            if (!header.startsWith(BEARER_PREFIX)) {
                return null;
            }
            return header.substring(BEARER_PREFIX.length()).trim();
        }
        else if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                         .filter(cookie -> cookie.getName().equals("globe42_token"))
                         .map(Cookie::getValue)
                         .findAny()
                         .orElse(null);
        }
        else {
            return null;
        }
    }
}
