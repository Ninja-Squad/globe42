package org.globe42.web.security;

import static org.mockito.Mockito.when;

import java.util.Optional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.web.exception.ForbiddenException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Integration test to verify that calling a method annotated with {@link AdminOnly} while not being an admin
 * indeed triggers the aspect and throws an exception
 * @author JB Nizet
 */
@SpringBootTest
@RunWith(SpringRunner.class)
@TestPropertySource("/test.properties")
public class AdminOnlyIntegrationTest {

    @MockBean
    private CurrentUser mockCurrentUser;

    @MockBean
    private UserDao mockUserDao;

    @SpyBean
    private AdminOnlyTester adminOnlyTester;

    @Before
    public void prepare() {
        long userId = 42L;
        when(mockCurrentUser.getUserId()).thenReturn(userId);
        User user = new User(userId);
        user.setAdmin(false);
        when(mockUserDao.findById(userId)).thenReturn(Optional.of(user));
    }

    @Test(expected = ForbiddenException.class)
    public void shouldThrowWhenCallingAdminOnlyAnnotatedMethod() {
        adminOnlyTester.foo();
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
