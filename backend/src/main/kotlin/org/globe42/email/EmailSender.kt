package org.globe42.email

import com.fasterxml.jackson.annotation.JsonInclude
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.bodyToMono

/**
 * Service used to send emails via Sendgrid
 * @author JB Nizet
 */
@Component
class EmailSender(
    @Sendgrid private val webClient: WebClient,
    private val properties: SendgridProperties
) {

    private val logger = LoggerFactory.getLogger(EmailSender::class.java)

    fun sendEmailAsync(
        to: String,
        subject: String,
        message: String
    ) {
        if (properties.apiKey.isNullOrBlank()) {
            logger.warn("Since no sendgrid API key is defined in the property globe42.sendgrid.api-key, the email is not sent.")
            return
        }

        val email = Email(
            from = Recipient("noreply@globe42.fr", "Globe42"),
            personalizations = listOf(
                Personalizations(
                    to = listOf(Recipient(to))
                )
            ),
            subject = subject,
            content = listOf(
                Content(
                    type = MediaType.TEXT_PLAIN_VALUE,
                    value = message
                )
            )
        )

        webClient.post()
            .uri("/mail/send")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(email)
            .retrieve()
            .bodyToMono<Unit>().subscribe()
    }
}

private data class Email(
    val from: Recipient,
    val personalizations: List<Personalizations>,
    val subject: String,
    val content: List<Content>
)

private data class Personalizations(val to: List<Recipient>)

private data class Recipient(
    val email: String,
    @field:JsonInclude(JsonInclude.Include.NON_EMPTY) val name: String? = null)

private data class Content(
    val type: String,
    val value: String
)
