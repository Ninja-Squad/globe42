package org.globe42.web

import org.springframework.stereotype.Component
import java.io.IOException
import javax.servlet.*
import javax.servlet.annotation.WebFilter
import javax.servlet.http.HttpServletRequest

/**
 * Filter that forwards all GET requests to non-static and non-api resources to index.html
 * @author JB Nizet
 */
@Component
@WebFilter(value = ["/*"])
class IndexFilter : Filter {
    @Throws(IOException::class, ServletException::class)
    override fun doFilter(
        req: ServletRequest,
        response: ServletResponse,
        chain: FilterChain
    ) {
        val request = req as HttpServletRequest
        if (mustForward(request)) {
            request.getRequestDispatcher("/index.html").forward(request, response)
            return
        }

        chain.doFilter(request, response)
    }

    private fun mustForward(request: HttpServletRequest): Boolean {
        if (request.method != "GET") {
            return false
        }

        val uri = request.requestURI

        return !(uri.startsWith("/api")
                || uri.endsWith(".js")
                || uri.endsWith(".css")
                || uri.startsWith("/index.html")
                || uri.endsWith(".ico")
                || uri.endsWith(".png")
                || uri.endsWith(".jpg")
                || uri.endsWith(".gif")
                || uri.endsWith(".eot")
                || uri.endsWith(".svg")
                || uri.endsWith(".woff2")
                || uri.endsWith(".ttf")
                || uri.endsWith(".woff")
                || uri.startsWith("/actuator"))
    }

    @Throws(ServletException::class)
    override fun init(filterConfig: FilterConfig) {
        // nothing to do
    }

    override fun destroy() {
        // nothing to do
    }
}
