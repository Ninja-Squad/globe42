package org.globe42.web.security

import org.assertj.core.api.Assertions.assertThat

import org.junit.jupiter.api.Test

/**
 * Unit tests for [PasswordDigester]
 * @author JB Nizet
 */
class PasswordDigesterTest {
    @Test
    fun hashedPasswordShouldMatch() {
        val password = "password"
        val digester = PasswordDigester()
        val hash = digester.hash(password)
        assertThat(digester.match(password, hash)).isTrue()
    }

    @Test
    fun passwordShouldNotMatchWithNullHashedPassword() {
        val digester = PasswordDigester()
        assertThat(digester.match("foobar", null)).isFalse()
    }

    @Test
    fun badPasswordShouldNotMatch() {
        val password = "password"
        val digester = PasswordDigester()
        assertThat(digester.match("badPassword", digester.hash(password)))
    }

    @Test
    fun hashesShouldBeDifferentWithSamePassword() {
        val password = "password"
        val digester = PasswordDigester()
        val hash1 = digester.hash(password)
        val hash2 = digester.hash(password)
        assertThat(hash1).isNotEqualTo(hash2)
    }
}
