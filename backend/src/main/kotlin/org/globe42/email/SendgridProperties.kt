package org.globe42.email

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import org.springframework.boot.context.properties.ImmutableConfigurationProperties
import org.springframework.validation.annotation.Validated

/**
 * Configuration properties for Sendgrid
 * @author JB Nizet
 */
@ConfigurationProperties(prefix = "globe42.sendgrid")
@ConstructorBinding
@Validated
data class SendgridProperties(
    /**
     * If null or blank, no email will be sent
     */
    val apiKey: String? = null
)
