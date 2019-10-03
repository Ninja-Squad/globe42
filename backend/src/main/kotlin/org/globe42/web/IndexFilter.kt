package org.globe42.web

import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.annotation.WebFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Filter that forwards all GET requests to non-static and non-api resources to index.html.
 *
 * In production (based on the X-Forwarded-Proto header, as described in the
 * [clever cloud documentation](https://www.clever-cloud.com/doc/get-help/faq/#how-to-know-if-a-user-comes-from-a-secure-connection-),
 * it also redirects from the http to the https https url, or sends a 403.
 * @author JB Nizet
 */
@Component
@WebFilter(value = ["/*"])
@Order(-1) // so that it's called before the authentication filter
class IndexFilter : Filter {
    override fun doFilter(
        request: ServletRequest,
        response: ServletResponse,
        chain: FilterChain
    ) {
        request as HttpServletRequest
        response as HttpServletResponse

        if (mustForward(request)) {
            if (request.inProductionOnHttp()) {
                response.sendRedirect(request.toCompleteHttpsUrl())
            }
            else {
                request.getRequestDispatcher("/index.html").forward(request, response)
            }
            return
        }

        if (request.inProductionOnHttp()) {
            response.sendError(HttpStatus.FORBIDDEN.value(), "HTTP is not supported. Only HTTPS is.")
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

    private fun HttpServletRequest.inProductionOnHttp() = getHeader("X-Forwarded-Proto") == "http"
    private fun HttpServletRequest.toCompleteHttpsUrl() =
        "https://bd.globe42.fr" + requestURI + (queryString?.let { "?" + queryString } ?: "")
}
