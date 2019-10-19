package org.globe42.web.security

import org.globe42.dao.UserDao
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * Configuration of the WebMvc application
 * @author JB Nizet
 */
@Configuration
class AuthenticationConfig {

    @Bean
    fun authenticationFilterRegistration(authenticationFilter: AuthenticationFilter): FilterRegistrationBean<AuthenticationFilter> {
        val filterRegistrationBean = FilterRegistrationBean(authenticationFilter)
        filterRegistrationBean.urlPatterns = listOf("/api/*", "/actuator", "/actuator/*")
        return filterRegistrationBean
    }

    @Bean
    fun authenticationFilter(jwtHelper: JwtHelper, currentUser: CurrentUser, userDao: UserDao) =
        AuthenticationFilter(jwtHelper, currentUser, userDao)
}
