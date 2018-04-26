package org.globe42.web.users

import org.globe42.domain.User

/**
 * Basic information about the current user
 * @author JB Nizet
 */
data class CurrentUserDTO(val id: Long, val login: String, val admin: Boolean) {
    constructor(user: User) : this(user.id!!, user.login, user.admin)
}
