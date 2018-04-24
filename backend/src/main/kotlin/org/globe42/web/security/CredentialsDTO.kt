package org.globe42.web.security

import javax.validation.constraints.NotEmpty

/**
 * Credentials sent by a user to authenticate
 * @author JB Nizet
 */
data class CredentialsDTO(
        @field:NotEmpty val login: String,

        /**
         * The password, in clear text.
         */
        @field:NotEmpty val password: String)
