package org.globe42.web.exception

import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.boot.web.servlet.error.ErrorAttributes
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.context.request.WebRequest

/**
 * Spring Configuration class that adds a custom [ErrorAttributes] bean to the context, in order to
 * add a `functionalError` attribute to the JSON body of error responses when the exception
 * is a [BadRequestException]
 * @author JB Nizet
 */
@Configuration
class ExceptionConfig {
    @Bean
    fun errorAttributes(): ErrorAttributes {
        return CustomErrorAttributes()
    }

    open class CustomErrorAttributes : DefaultErrorAttributes {
        constructor()

        constructor(includeException: Boolean) : super(includeException)

        override fun getErrorAttributes(webRequest: WebRequest, includeStackTrace: Boolean): Map<String, Any> {
            val result = super.getErrorAttributes(webRequest, includeStackTrace)

            val error = getError(webRequest)
            if (error is BadRequestException) {
                val exception = error
                if (exception.error != null) {
                    result["functionalError"] = exception.error
                }
            }
            return result
        }
    }
}
