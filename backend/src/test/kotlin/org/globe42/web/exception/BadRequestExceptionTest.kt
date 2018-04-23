package org.globe42.web.exception

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.entry
import org.junit.jupiter.api.Test
import java.util.*

/**
 * Unit tests for [BadRequestException]
 * @author JB Nizet
 */
class BadRequestExceptionTest {
    @Test
    fun `should create with message`() {
        val e = BadRequestException("foo")

        assertThat(e.error).isNull()
        assertThat(e.message).isEqualTo("foo")
    }

    @Test
    fun `should create with error code`() {
        val e = BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS)

        assertThat(e.message).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString())
        assertThat(e.error!!.code).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        assertThat(e.error!!.parameters).isEmpty()
    }

    @Test
    fun `should create with error code and parameter`() {
        val e = BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS, "foo", "bar")

        assertThat(e.message).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString())
        assertThat(e.error!!.code).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        assertThat(e.error!!.parameters).containsOnly(entry("foo", "bar"))
    }

    @Test
    fun `should create with functional error`() {
        val e = BadRequestException(FunctionalError(ErrorCode.USER_LOGIN_ALREADY_EXISTS,
                                                    Collections.singletonMap("foo", "bar")))

        assertThat(e.message).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString())
        assertThat(e.error!!.code).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        assertThat(e.error!!.parameters).containsOnly(entry("foo", "bar"))
    }
}