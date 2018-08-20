package org.globe42.web.exception

import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.spy
import com.nhaarman.mockitokotlin2.whenever
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

        result = spy(result)
        val exception = BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        doReturn(exception).whenever(result).getError(webRequest)

        val errorAttributes = result.getErrorAttributes(webRequest, false)

        assertThat(errorAttributes["functionalError"]).isEqualTo(exception.error)
    }

    @Test
    fun `should not include functional error if not present`() {
        var result = ExceptionConfig().errorAttributes()
        val request = MockHttpServletRequest()
        val webRequest = ServletWebRequest(request)

        result = spy(result)
        val exception = BadRequestException("foo")
        doReturn(exception).whenever(result).getError(webRequest)

        val errorAttributes = result.getErrorAttributes(webRequest, false)

        assertThat(errorAttributes.containsKey("functionalError")).isFalse()
    }

    @Test
    fun `should not include functional error if not bad request exception`() {
        var result = ExceptionConfig().errorAttributes()
        val request = MockHttpServletRequest()
        val webRequest = ServletWebRequest(request)

        result = spy(result)
        val exception = IllegalStateException("foo")
        doReturn(exception).whenever(result).getError(webRequest)

        val errorAttributes = result.getErrorAttributes(webRequest, false)

        assertThat(errorAttributes.containsKey("functionalError")).isFalse()
    }
}
