package org.globe42.web

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * Configuration used to set an infinite max-age on static assets that can be cached forever (because
 * their name contains a hash that changed every time they're modified)
 * @author JB Nizet
 */
@Configuration
class MaxAgeCacheConfig : WebMvcConfigurer {

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("*.bundle.js", "*.bundle.css", "fontawesome-webfont.*")
                .addResourceLocations("classpath:/static/", "classpath:/public/")
                .setCachePeriod(Integer.MAX_VALUE)
    }
}
