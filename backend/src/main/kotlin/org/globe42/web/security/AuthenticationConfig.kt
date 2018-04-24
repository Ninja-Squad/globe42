package org.globe42.web.security

import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.*

/**
 * Configuration of the WebMvc application
 * @author JB Nizet
 */
@Configuration
class AuthenticationConfig {

    @Bean
    fun authenticationFilterRegistration(): FilterRegistrationBean<AuthenticationFilter> {
        val filterRegistrationBean = FilterRegistrationBean(authenticationFilter())
        filterRegistrationBean.urlPatterns = Arrays.asList("/api/*", "/actuator", "/actuator/*")
        return filterRegistrationBean
    }

    @Bean
    fun authenticationFilter(): AuthenticationFilter {
        return AuthenticationFilter()
    }
}
