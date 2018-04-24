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
    fun shouldCreateWithMessage() {
        val e = BadRequestException("foo")

        assertThat(e.error).isNull()
        assertThat(e.message).isEqualTo("foo")
    }

    @Test
    fun shouldCreateWithErrorCode() {
        val e = BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS)

        assertThat(e.message).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString())
        assertThat(e.error!!.code).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        assertThat(e.error!!.parameters).isEmpty()
    }

    @Test
    fun shouldCreateWithErrorCodeAndParameter() {
        val e = BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS, "foo", "bar")

        assertThat(e.message).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString())
        assertThat(e.error!!.code).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        assertThat(e.error!!.parameters).containsOnly(entry("foo", "bar"))
    }

    @Test
    fun shouldCreateWithFunctionalError() {
        val e = BadRequestException(FunctionalError(ErrorCode.USER_LOGIN_ALREADY_EXISTS,
                                                    Collections.singletonMap("foo", "bar")))

        assertThat(e.message).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString())
        assertThat(e.error!!.code).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        assertThat(e.error!!.parameters).containsOnly(entry("foo", "bar"))
    }
}
