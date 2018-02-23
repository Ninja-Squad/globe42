package org.globe42.test;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;

/**
 * Base class for unit tests, enabling Mockito annotations
 * @author JB Nizet
 */
public class BaseTest {
    @BeforeEach
    public void initMockito() {
        MockitoAnnotations.initMocks(this);
    }
}
