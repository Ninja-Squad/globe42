package org.globe42.web.security;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import org.globe42.dao.UserDao;
import org.globe42.web.exception.ForbiddenException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * Integration test to verify that calling a method annotated with {@link AdminOnly} while not being an admin
 * indeed triggers the aspect and throws an exception
 * @author JB Nizet
 */
@SpringBootTest
@ExtendWith(SpringExtension.class)
@TestPropertySource("/test.properties")
public class AdminOnlyIntegrationTest {

    @MockBean
    private CurrentUser mockCurrentUser;

    @MockBean
    private UserDao mockUserDao;

    @SpyBean
    private AdminOnlyTester adminOnlyTester;

    @BeforeEach
    public void prepare() {
        long userId = 42L;
        when(mockCurrentUser.getUserId()).thenReturn(userId);
        when(mockUserDao.existsNotDeletedAdminById(userId)).thenReturn(false);
    }

    @Test
    public void shouldThrowWhenCallingAdminOnlyAnnotatedMethod() {
        assertThatExceptionOfType(ForbiddenException.class).isThrownBy(() -> adminOnlyTester.foo());
    }

    @Test
    public void shouldNotThrowWhenCallingNotAnnotatedMethod() {
        adminOnlyTester.bar();
    }

    public static class AdminOnlyTester {
        @AdminOnly
        public void foo() {
        }

        public void bar() {
        }
    }
}
