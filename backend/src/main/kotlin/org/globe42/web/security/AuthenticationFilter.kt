package org.globe42.web.security;

import java.io.IOException;
import java.util.Arrays;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.jsonwebtoken.Claims;
import org.globe42.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

/**
 * Servlet filter used to check that the user is authenticated, on all API URLs except <code>/api/authentication</code>.
 * It also checks that the user is authenticated and is an admin for all actuator endpoints, except
 * <code>/actuator/health</code> which is allowed to anyone.
 *
 * This servlet is registered by {@link AuthenticationConfig}.
 *
 * @author JB Nizet
 */
public class AuthenticationFilter implements Filter {

    private static final String BEARER_PREFIX = "Bearer ";

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private CurrentUser currentUser;

    @Autowired
    private UserDao userDao;

    @Override
    public void init(FilterConfig filterConfig) {
        // nothing to do
    }

    @Override
    public void doFilter(ServletRequest req,
                         ServletResponse resp,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;

        Long userId = extractUserIdFromToken(request);
        currentUser.setUserId(userId);

        if ((isProtectedApiRequest(request) || isProtectedActuatorRequest(request))
            && (userId == null || !userDao.existsNotDeletedById(userId))) {
            response.sendError(HttpStatus.UNAUTHORIZED.value());
        }
        else if (isProtectedActuatorRequest(request) && !userDao.existsNotDeletedAdminById(userId)) {
            response.sendError(HttpStatus.FORBIDDEN.value());
        }
        else {
            chain.doFilter(req, response);
        }
    }

    private boolean isProtectedActuatorRequest(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        return requestURI.startsWith("/actuator") && !requestURI.equals("/actuator/health");
    }

    private boolean isProtectedApiRequest(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        return requestURI.startsWith("/api") && !requestURI.equals("/api/authentication");
    }

    @Override
    public void destroy() {
        // nothing to do
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
            return null;
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
