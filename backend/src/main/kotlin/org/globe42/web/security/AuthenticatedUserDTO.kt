package org.globe42.web.security

import org.globe42.domain.User

/**
 * A user, with its JWT token
 * @author JB Nizet
 */
data class AuthenticatedUserDTO(
    val id: Long,
    val login: String,
    val admin: Boolean,
    val token: String
) {

    constructor(user: User, token: String) : this(user.id!!, user.login!!, user.admin, token)
}
