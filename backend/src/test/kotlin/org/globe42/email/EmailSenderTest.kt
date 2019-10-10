package org.globe42.email

import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.assertj.core.api.Assertions.assertThat
import org.intellij.lang.annotations.Language
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.skyscreamer.jsonassert.JSONAssert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.client.WebClient

/**
 * Tests for [EmailSender]
 * @author JB Nizet
 */
@RestClientTest
class EmailSenderTest(@Autowired val webClientBuilder: WebClient.Builder) {

    lateinit var server: MockWebServer

    @BeforeEach
    fun prepare() {
        server = MockWebServer().apply { start() }
    }

    @AfterEach
    fun cleanup() {
        server.shutdown()
    }

    @Test
    fun `should send an email`() {
        val properties = SendgridProperties("key1")
        val webClient = EmailConfig(webClientBuilder, properties).sendGridWebClient()
        val sender = EmailSender(
            webClient.mutate().baseUrl(server.url("/api/v3").toString()).build(),
            properties
        )

        server.enqueue(MockResponse().setBody(""))

        sender.sendEmailAsync("john@doe.com", "subject", "message")

        val request = server.takeRequest()
        assertThat(request.path).isEqualTo("/api/v3/mail/send")
        assertThat(request.getHeader(HttpHeaders.AUTHORIZATION)).isEqualTo("Bearer key1")
        assertThat(request.getHeader(HttpHeaders.CONTENT_TYPE)).isEqualTo(MediaType.APPLICATION_JSON_VALUE)

        val body = request.body.readUtf8()
        @Language("JSON") val expectedJson = """
            {
                "from": {
                    "email": "noreply@globe42.fr",
                    "name": "Globe42"
                },
                "personalizations": [
                    {
                        "to": [
                            {
                                "email": "john@doe.com"
                            }
                        ]
                    }
                ],
                "subject": "subject",
                "content": [
                    {
                        "type": "text/plain",
                        "value": "message"
                    }
                ]
            }
            """.trimIndent()
        JSONAssert.assertEquals(expectedJson, body, false)
    }

    @Test
    fun `should not send if no API key`() {
        val properties = SendgridProperties()
        val webClient = EmailConfig(webClientBuilder, properties).sendGridWebClient()
        val sender = EmailSender(
            webClient.mutate().baseUrl(server.url("/api/v3").toString()).build(),
            properties
        )

        sender.sendEmailAsync("john@doe.com", "subject", "message")

        assertThat(server.requestCount).isEqualTo(0)
    }
}
