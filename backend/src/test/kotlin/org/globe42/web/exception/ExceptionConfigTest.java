package org.globe42.web.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

/**
 * Unit tests for {@link ExceptionConfig}
 * @author JB Nizet
 */
public class ExceptionConfigTest {
    @Test
    public void shouldIncludeFunctionalError() {
        ErrorAttributes result = new ExceptionConfig().errorAttributes();
        MockHttpServletRequest request = new MockHttpServletRequest();
        WebRequest webRequest = new ServletWebRequest(request);

        result = spy(result);
        BadRequestException exception = new BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS);
        doReturn(exception).when(result).getError(webRequest);

        Map<String, Object> errorAttributes = result.getErrorAttributes(webRequest, false);

        assertThat(errorAttributes.get("functionalError")).isEqualTo(exception.getError());
    }

    @Test
    public void shouldNotIncludeFunctionalErrorIfNotPresent() {
        ErrorAttributes result = new ExceptionConfig().errorAttributes();
        MockHttpServletRequest request = new MockHttpServletRequest();
        WebRequest webRequest = new ServletWebRequest(request);

        result = spy(result);
        BadRequestException exception = new BadRequestException("foo");
        doReturn(exception).when(result).getError(webRequest);

        Map<String, Object> errorAttributes = result.getErrorAttributes(webRequest, false);

        assertThat(errorAttributes.containsKey("functionalError")).isFalse();
    }

    @Test
    public void shouldNotIncludeFunctionalErrorIfNotBadRequestException() {
        ErrorAttributes result = new ExceptionConfig().errorAttributes();
        MockHttpServletRequest request = new MockHttpServletRequest();
        WebRequest webRequest = new ServletWebRequest(request);

        result = spy(result);
        IllegalStateException exception = new IllegalStateException("foo");
        doReturn(exception).when(result).getError(webRequest);

        Map<String, Object> errorAttributes = result.getErrorAttributes(webRequest, false);

        assertThat(errorAttributes.containsKey("functionalError")).isFalse();
    }
}
