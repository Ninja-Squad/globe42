package org.globe42.web.exception

import io.mockk.every
import io.mockk.spyk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.web.context.request.ServletWebRequest

/**
 * Unit tests for [ExceptionConfig]
 * @author JB Nizet
 */
class ExceptionConfigTest {
    @Test
    fun `should include functional error`() {
        var result = ExceptionConfig().errorAttributes()
        val request = MockHttpServletRequest()
        val webRequest = ServletWebRequest(request)

        result = spyk(result)
        val exception = BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        every { result.getError(webRequest) } returns exception

        val errorAttributes = result.getErrorAttributes(webRequest, false)

        assertThat(errorAttributes["functionalError"]).isEqualTo(exception.error)
    }

    @Test
    fun `should not include functional error if not present`() {
        var result = ExceptionConfig().errorAttributes()
        val request = MockHttpServletRequest()
        val webRequest = ServletWebRequest(request)

        result = spyk(result)
        val exception = BadRequestException("foo")
        every { result.getError(webRequest) } returns exception

        val errorAttributes = result.getErrorAttributes(webRequest, false)

        assertThat(errorAttributes.containsKey("functionalError")).isFalse()
    }

    @Test
    fun `should not include functional error if not bad request exception`() {
        var result = ExceptionConfig().errorAttributes()
        val request = MockHttpServletRequest()
        val webRequest = ServletWebRequest(request)

        result = spyk(result)
        val exception = IllegalStateException("foo")
        every { result.getError(webRequest) } returns exception

        val errorAttributes = result.getErrorAttributes(webRequest, false)

        assertThat(errorAttributes.containsKey("functionalError")).isFalse()
    }
}
