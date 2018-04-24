package org.globe42.web.users

import javax.validation.constraints.NotEmpty

/**
 * Command sent to change the password of the current user
 * @author JB Nizet
 */
data class ChangePasswordCommandDTO(@field:NotEmpty val newPassword: String)
