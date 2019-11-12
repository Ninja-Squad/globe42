package org.globe42.email

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.web.reactive.function.client.WebClient

/**
 * Configuration for Email sending via Sendgrid
 * @author JB Nizet
 */
@Configuration
@EnableConfigurationProperties(SendgridProperties::class)
class EmailConfig(
    private val webClientBuilder: WebClient.Builder,
    private val properties: SendgridProperties
) {
    @Bean
    @Sendgrid
    fun sendGridWebClient(): WebClient {
        return webClientBuilder
            .baseUrl("https://api.sendgrid.com/v3")
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer ${properties.apiKey}")
            .build()
    }
}
