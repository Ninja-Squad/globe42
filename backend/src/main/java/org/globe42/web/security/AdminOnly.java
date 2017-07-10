package org.globe42.web.security;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Annotation allowing to install the aspect {@link AdminOnly} on a method.
 * @author JB Nizet
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AdminOnly {
}
