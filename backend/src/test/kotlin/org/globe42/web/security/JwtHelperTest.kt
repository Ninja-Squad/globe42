package org.globe42.web.security

import io.jsonwebtoken.security.Keys
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.*

/**
 * Unit tests for JwtHelper
 * @author JB Nizet
 */
class JwtHelperTest {
    private lateinit var jwtHelper: JwtHelper

    @BeforeEach
    fun prepare() {
        jwtHelper = JwtHelper(Base64.getEncoder().encodeToString(Keys.secretKeyFor(SIGNATURE_ALGORITHM).encoded))
    }

    @Test
    fun `should build and parse token`() {
        // given a user
        val userId = 42L

        // when building a token
        val token = jwtHelper.buildToken(userId)

        // then we should have a token
        assertThat(token.length).isGreaterThan(20)

        val claims = jwtHelper.extractClaims(token)
        val extractedUserId = java.lang.Long.parseLong(claims.subject)
        assertThat(extractedUserId).isEqualTo(userId)
    }
}
