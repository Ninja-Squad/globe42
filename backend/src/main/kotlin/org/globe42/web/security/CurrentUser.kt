package org.globe42.web.security

import org.springframework.context.annotation.Scope
import org.springframework.context.annotation.ScopedProxyMode
import org.springframework.stereotype.Component
import org.springframework.web.context.WebApplicationContext

/**
 * Request-scoped bean containing the ID of the current user
 * @author JB Nizet
 */
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Component
class CurrentUser {
    /**
     * Gets/Sets the current user ID. Setter intentionally only visible to classes in the same package.
     */
    var userId: Long? = null
        internal set
}
