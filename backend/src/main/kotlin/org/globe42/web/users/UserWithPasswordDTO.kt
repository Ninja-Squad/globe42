package org.globe42.web.users

import com.fasterxml.jackson.annotation.JsonUnwrapped
import org.globe42.domain.User

/**
 * The information returned by a user creation. It contains a generated password, that must be transferred
 * to the actual user.
 * @author JB Nizet
 */
data class UserWithPasswordDTO(@field:JsonUnwrapped val user: UserDTO, val generatedPassword: String) {
    constructor(user: User, generatedPassword: String) : this(UserDTO(user), generatedPassword)
}
