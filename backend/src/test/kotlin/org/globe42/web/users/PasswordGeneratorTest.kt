package org.globe42.web.users

import org.assertj.core.api.Assertions.assertThat

import org.junit.jupiter.api.Test

/**
 * Unit tests for [PasswordGenerator]
 * @author JB Nizet
 */
class PasswordGeneratorTest {
    @Test
    fun shouldGenerate() {
        val passwordGenerator = PasswordGenerator()

        val p1 = passwordGenerator.generatePassword()
        val p2 = passwordGenerator.generatePassword()
        assertThat(p1).hasSize(8)
        assertThat(p2).hasSize(8)
        assertThat(p1).isNotEqualTo(p2)
    }
}
