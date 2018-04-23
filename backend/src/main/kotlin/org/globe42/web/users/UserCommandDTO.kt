package org.globe42.web.users

import javax.validation.constraints.NotEmpty

/**
 * Command passed to create or update a user
 * @author JB Nizet
 */
data class UserCommandDTO(

    /**
     * The new login of the user.
     */
    @field:NotEmpty
    val login: String,

    /**
     * The new admin flag of the user.
     */
    val admin: Boolean
)
