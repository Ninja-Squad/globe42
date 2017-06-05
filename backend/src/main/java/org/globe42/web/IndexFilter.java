package org.globe42.web;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

/**
 * Filter that forwards all GET requests to non-static and non-api resources to index.html
 * @author JB Nizet
 */
@Component
@WebFilter(value = "/*")
public class IndexFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req,
                         ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        if (mustForward(request)) {
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean mustForward(HttpServletRequest request) {
        if (!request.getMethod().equals("GET")) {
            return false;
        }

        String uri = request.getRequestURI();

        return !(uri.startsWith("/api")
            || uri.endsWith(".js")
            || uri.endsWith(".css")
            || uri.startsWith("/index.html")
            || uri.endsWith(".ico")
            || uri.endsWith(".eot")
            || uri.endsWith(".svg")
            || uri.endsWith(".woff2")
            || uri.endsWith(".ttf")
            || uri.endsWith(".woff"));
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // nothing to do
    }

    @Override
    public void destroy() {
        // nothing to do
    }
}
