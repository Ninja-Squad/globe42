package org.globe42.web.security

import org.globe42.dao.UserDao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import java.util.*
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

private const val BEARER_PREFIX = "Bearer "

/**
 * Servlet filter used to check that the user is authenticated, on all API URLs except `/api/authentication`.
 * It also checks that the user is authenticated and is an admin for all actuator endpoints, except
 * `/actuator/health` which is allowed to anyone.
 *
 * This servlet is registered by [AuthenticationConfig].
 *
 * @author JB Nizet
 */
class AuthenticationFilter(
    private val jwtHelper: JwtHelper,
    private val currentUser: CurrentUser,
    private val userDao: UserDao
) : Filter {

    override fun doFilter(req: ServletRequest, resp: ServletResponse, chain: FilterChain) {
        val request = req as HttpServletRequest
        val response = resp as HttpServletResponse

        val userId = extractUserIdFromToken(request)
        currentUser.userId = userId

        if ((isProtectedApiRequest(request) || isProtectedActuatorRequest(request))
            && (userId == null || !userDao.existsNotDeletedById(userId))
        ) {
            response.sendError(HttpStatus.UNAUTHORIZED.value())
        } else if (isProtectedActuatorRequest(request) && (userId == null || !userDao.existsNotDeletedAdminById(userId))) {
            response.sendError(HttpStatus.FORBIDDEN.value())
        } else {
            chain.doFilter(req, response)
        }
    }

    private fun isProtectedActuatorRequest(request: HttpServletRequest): Boolean {
        val requestURI = request.requestURI
        return requestURI.startsWith("/actuator") && requestURI != "/actuator/health"
    }

    private fun isProtectedApiRequest(request: HttpServletRequest): Boolean {
        val requestURI = request.requestURI
        return requestURI.startsWith("/api") && requestURI != "/api/authentication"
    }

    private fun extractUserIdFromToken(request: HttpServletRequest): Long? {
        val token = extractToken(request) ?: return null

        try {
            val claims = jwtHelper.extractClaims(token)
            return claims.subject.toLong()
        } catch (e: Exception) {
            return null
        }
    }

    private fun extractToken(request: HttpServletRequest): String? {
        val header = request.getHeader(HttpHeaders.AUTHORIZATION)
        return if (header != null) {
            if (!header.startsWith(BEARER_PREFIX)) null else header.substring(BEARER_PREFIX.length).trim()
        } else if (request.cookies != null) {
            Arrays.stream(request.cookies)
                .filter { cookie -> cookie.name == "globe42_token" }
                .map { it.value }
                .findAny()
                .orElse(null)
        } else {
            null
        }
    }
}
