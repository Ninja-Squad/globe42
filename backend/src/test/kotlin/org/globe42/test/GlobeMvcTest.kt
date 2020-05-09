package org.globe42.test

import org.globe42.web.security.AuthenticationConfig
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.FilterType
import org.springframework.core.annotation.AliasFor
import kotlin.reflect.KClass

/**
 * Meta-annotation used to simplify the creation of MVC tests. Indeed, the AuthenticationConfig must be excluded
 * otherwise all requests fail with a 401, since requests don't have the required authorization header during tests
 *
 * @author JB Nizet
 */
@Target(AnnotationTarget.CLASS)
@WebMvcTest(
    excludeFilters = [ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = [AuthenticationConfig::class]
    )]
)
annotation class GlobeMvcTest(
    @get:AliasFor(annotation = WebMvcTest::class, attribute = "value")
    vararg val value: KClass<*>
)
