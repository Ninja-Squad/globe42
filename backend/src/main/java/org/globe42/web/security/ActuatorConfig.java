package org.globe42.web.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.globe42.dao.UserDao;
import org.globe42.web.exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.servlet.CorsEndpointProperties;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.servlet.WebMvcEndpointManagementContextConfiguration;
import org.springframework.boot.actuate.endpoint.web.EndpointMediaTypes;
import org.springframework.boot.actuate.endpoint.web.annotation.WebAnnotationEndpointDiscoverer;
import org.springframework.boot.actuate.endpoint.web.servlet.WebMvcEndpointHandlerMapping;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.handler.MappedInterceptor;

/**
 * Configuration class used to secure the actuator endpoints. Based on
 * https://github.com/spring-projects/spring-boot/issues/11234#issuecomment-348526099
 * @author JB Nizet
 */
@Configuration
public class ActuatorConfig extends WebMvcEndpointManagementContextConfiguration {

    public WebMvcEndpointHandlerMapping webEndpointServletHandlerMapping(WebAnnotationEndpointDiscoverer endpointDiscoverer,
                                                                         EndpointMediaTypes endpointMediaTypes,
                                                                         CorsEndpointProperties corsProperties,
                                                                         WebEndpointProperties webEndpointProperties) {
        WebMvcEndpointHandlerMapping mapping = super.webEndpointServletHandlerMapping(
            endpointDiscoverer,
            endpointMediaTypes,
            corsProperties,
            webEndpointProperties);

        mapping.setInterceptors(actuatorMappedInterceptor());

        return mapping;
    }

    @Bean
    public ActuatorInterceptor actuatorInterceptor() {
        return new ActuatorInterceptor();
    }

    /**
     * Creates an interceptor that is applied on the actuator endpoints, and that only allows admin users to access
     * the actuator endpoints, except for /actuator/health, which is allowed to anyone
     */
    @Bean
    public MappedInterceptor actuatorMappedInterceptor() {
        String[] includePatterns = {"/actuator", "/actuator/**/*" };
        String[] excludePatterns = {"/actuator/health" };
        return new MappedInterceptor(includePatterns, excludePatterns, actuatorInterceptor());
    }

    public static class ActuatorInterceptor extends AuthenticationInterceptor {

        @Autowired
        private UserDao userDao;

        @Autowired
        private CurrentUser currentUser;

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            super.preHandle(request, response, handler);

            if (!userDao.existsNotDeletedAdminById(currentUser.getUserId())) {
                throw new ForbiddenException();
            }

            return true;
        }
    }
}
