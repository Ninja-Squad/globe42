package org.globe42.test

import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.quality.Strictness

/**
 * Meta-annotation used to apply the [MockitoExtension] on a test class, and setting it
 * to lenient.
 * @author JB Nizet
 */
@ExtendWith(MockitoExtension::class)
@MockitoSettings(strictness = Strictness.LENIENT)
@Target(AnnotationTarget.CLASS)
annotation class Mockito
