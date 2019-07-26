package org.globe42.web.users

import com.fasterxml.jackson.annotation.JsonUnwrapped
import org.globe42.domain.User

/**
 * The profile of the current user
 * @author JB Nizet
 */
data class ProfileDTO(
    @JsonUnwrapped val user: CurrentUserDTO,
    val email: String?,
    val taskAssignmentEmailNotificationEnabled: Boolean
) {
    constructor(user: User) : this(
        user = CurrentUserDTO(user),
        email = user.email,
        taskAssignmentEmailNotificationEnabled = user.taskAssignmentEmailNotificationEnabled
    )
}
