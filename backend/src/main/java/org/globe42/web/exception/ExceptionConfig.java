package org.globe42.web.exception;

import java.util.Map;

import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.WebRequest;

/**
 * Spring Configuration class that adds a custom {@link ErrorAttributes} bean to the context, in order to
 * add a <code>functionalError</code> attribute to the JSON body of error responses when the exception
 * is a {@link BadRequestException}
 * @author JB Nizet
 */
@Configuration
public class ExceptionConfig {
    @Bean
    public ErrorAttributes errorAttributes() {
        return new CustomErrorAttributes();
    }

    public static class CustomErrorAttributes extends DefaultErrorAttributes {
        public CustomErrorAttributes() {
        }

        public CustomErrorAttributes(boolean includeException) {
            super(includeException);
        }

        @Override
        public Map<String, Object> getErrorAttributes(WebRequest webRequest, boolean includeStackTrace) {
            Map<String, Object> result = super.getErrorAttributes(webRequest, includeStackTrace);

            Throwable error = getError(webRequest);
            if (error instanceof BadRequestException) {
                BadRequestException exception = (BadRequestException) error;
                if (exception.getError() != null) {
                    result.put("functionalError", exception.getError());
                }
            }
            return result;
        }
    }
}
