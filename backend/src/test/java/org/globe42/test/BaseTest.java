package org.globe42.test;

import org.junit.Before;
import org.mockito.MockitoAnnotations;

/**
 * Base class for unit tests, enabling Mockito annotations
 * @author JB Nizet
 */
public class BaseTest {
    @Before
    public void initMockito() {
        MockitoAnnotations.initMocks(this);
    }
}
