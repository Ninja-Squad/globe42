package org.globe42.domain

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.regex.Pattern

/**
 * Unit tests for Person
 * @author JB Nizet
 */
class PersonTest {

    @Test
    fun `should validate fiscal number`() {
        val pattern = Pattern.compile(FISCAL_NUMBER_REGEXP)

        assertThat(pattern.matcher("1abcdefghijk3").matches()).isFalse()
        assertThat(pattern.matcher("123456789012").matches()).isFalse()
        assertThat(pattern.matcher("12345678901234").matches()).isFalse()
        assertThat(pattern.matcher("1234567890123").matches()).isTrue()
    }

    @Test
    fun `should accept empty string as fiscal number`() {
        val pattern = Pattern.compile(FISCAL_NUMBER_REGEXP)

        assertThat(pattern.matcher("").matches()).isTrue()
        assertThat(pattern.matcher(" ").matches()).isFalse()
    }
}