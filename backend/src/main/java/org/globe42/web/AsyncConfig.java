package org.globe42.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class used to configure a thread pool used for asynchronous request processing (file downloads)
 * @author JB Nizet
 */
@Configuration
public class AsyncConfig implements WebMvcConfigurer {
    @Override
    public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        taskExecutor.setCorePoolSize(1);
        taskExecutor.setMaxPoolSize(30);
        taskExecutor.setThreadNamePrefix("GlobeWebAsync");
        taskExecutor.initialize();
        configurer.setTaskExecutor(taskExecutor);
    }
}
