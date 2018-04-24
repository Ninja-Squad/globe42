package org.globe42.test

import org.junit.jupiter.api.BeforeEach
import org.mockito.MockitoAnnotations

/**
 * Base class for unit tests, enabling Mockito annotations
 * @author JB Nizet
 */
open class BaseTest {
    @BeforeEach
    fun initMockito() {
        MockitoAnnotations.initMocks(this)
    }
}
