package org.globe42.web.security;

import static org.mockito.Mockito.when;

import org.assertj.core.api.Assertions;
import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.ForbiddenException;
import org.junit.jupiter.api.Test;
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

    @Test
    public void shouldThrowIfNoCurrentUserOrCurrentUserNotAdmin() {
        long userId = 42L;
        when(mockCurrentUser.getUserId()).thenReturn(userId);
        when(mockUserDao.existsNotDeletedAdminById(userId)).thenReturn(false);

        Assertions.assertThatExceptionOfType(ForbiddenException.class).isThrownBy(
            () -> aspect.checkUserIsAdmin(null));
    }

    @Test
    public void shouldNotThrowIfCurrentUserIsAdmin() {
        long userId = 42L;
        when(mockCurrentUser.getUserId()).thenReturn(userId);
        User user = new User(userId);
        user.setAdmin(true);

        when(mockUserDao.existsNotDeletedAdminById(userId)).thenReturn(true);

        aspect.checkUserIsAdmin(null);
    }
}
