package org.globe42.web

import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.web.filter.ForwardedHeaderFilter

/**
 * Configuration class used to add a servlet filter used to make the actuator think that it's
 * running on HTTPS, and thus generate the correct URLs, in production where the app sits behind a proxy
 * @author JB Nizet
 */
@Configuration
class HttpsActuatorConfig {
    @Bean
    fun forwardedHeaderFilterFilterRegistrationBean(): FilterRegistrationBean<ForwardedHeaderFilter>? {
        return FilterRegistrationBean(ForwardedHeaderFilter()).apply {
            setOrder(-1)
        }
    }
}
