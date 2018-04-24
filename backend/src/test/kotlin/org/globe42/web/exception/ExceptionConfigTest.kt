package org.globe42.web.exception

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.spy
import com.nhaarman.mockito_kotlin.whenever
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
    fun shouldIncludeFunctionalError() {
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
    fun shouldNotIncludeFunctionalErrorIfNotPresent() {
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
    fun shouldNotIncludeFunctionalErrorIfNotBadRequestException() {
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
