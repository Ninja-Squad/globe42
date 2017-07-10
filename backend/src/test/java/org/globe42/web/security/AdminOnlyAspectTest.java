package org.globe42.web.security;

import static org.mockito.Mockito.when;

import java.util.Optional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.ForbiddenException;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link AdminOnlyAspect}
 * @author JB Nizet
 */
public class AdminOnlyAspectTest extends BaseTest {
    @Mock
    private CurrentUser mockCurrentUser;

    @Mock
    private UserDao mockUserDao;

    @InjectMocks
    private AdminOnlyAspect aspect;

    @Test(expected = ForbiddenException.class)
    public void shouldThrowIfNoCurrentUser() {
        long userId = 42L;
        when(mockCurrentUser.getUserId()).thenReturn(userId);
        when(mockUserDao.findById(userId)).thenReturn(Optional.empty());

        aspect.checkUserIsAdmin(null);
    }

    @Test(expected = ForbiddenException.class)
    public void shouldThrowIfCurrentUserIsNotAdmin() {
        long userId = 42L;
        when(mockCurrentUser.getUserId()).thenReturn(userId);
        User user = new User(userId);
        user.setAdmin(false);

        when(mockUserDao.findById(userId)).thenReturn(Optional.of(user));

        aspect.checkUserIsAdmin(null);
    }

    @Test
    public void shouldNotThrowIfCurrentUserIsAdmin() {
        long userId = 42L;
        when(mockCurrentUser.getUserId()).thenReturn(userId);
        User user = new User(userId);
        user.setAdmin(true);

        when(mockUserDao.findById(userId)).thenReturn(Optional.of(user));

        aspect.checkUserIsAdmin(null);
    }
}
