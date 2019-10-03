package org.globe42.email

import org.springframework.boot.context.properties.ImmutableConfigurationProperties
import org.springframework.validation.annotation.Validated

/**
 * Configuration properties for Sendgrid
 * @author JB Nizet
 */
@ImmutableConfigurationProperties(prefix = "globe42.sendgrid")
@Validated
data class SendgridProperties(
    /**
     * If null or blank, no email will be sent
     */
    var apiKey: String? = null
)
