package org.globe42.web.users

import org.globe42.domain.User

/**
 * A user of the application
 * @author JB Nizet
 */
data class UserDTO(val id: Long, val login: String, val admin: Boolean) {
    constructor(user: User) : this(user.id!!, user.login, user.admin)
}
