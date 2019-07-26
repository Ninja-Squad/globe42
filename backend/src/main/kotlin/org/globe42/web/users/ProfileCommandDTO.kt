package org.globe42.web.users

import javax.validation.constraints.Email

/**
 * The command sent to update the profile of the current user
 * @author JB Nizet
 */
data class ProfileCommandDTO(
    @field:Email val email: String?,
    val taskAssignmentEmailNotificationEnabled: Boolean
)
