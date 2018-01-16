package org.globe42.web.security;

import java.util.Arrays;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration of the WebMvc application
 * @author JB Nizet
 */
@Configuration
public class AuthenticationConfig {

    @Bean
    public FilterRegistrationBean<AuthenticationFilter> authenticationFilterRegistration() {
        FilterRegistrationBean<AuthenticationFilter> filterRegistrationBean =
            new FilterRegistrationBean<>(authenticationFilter());
        filterRegistrationBean.setUrlPatterns(Arrays.asList("/api/*", "/actuator", "/actuator/*"));
        return filterRegistrationBean;
    }

    @Bean
    public AuthenticationFilter authenticationFilter() {
        return new AuthenticationFilter();
    }
}
