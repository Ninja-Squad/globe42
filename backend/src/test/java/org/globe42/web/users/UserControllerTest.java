package org.globe42.web.users;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.CurrentUser;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link UserController}
 * @author JB Nizet
 */
public class UserControllerTest extends BaseTest{
    @Mock
    private CurrentUser mockCurrentUser;

    @Mock
    private UserDao mockUserDao;

    @InjectMocks
    private UserController controller;

    private Long userId = 42L;

    @Before
    public void prepare() {
        when(mockCurrentUser.getUserId()).thenReturn(userId);
    }

    @Test
    public void shouldGetCurrentUser() {
        User user = createUser(userId);
        when(mockUserDao.findById(userId)).thenReturn(Optional.of(user));

        CurrentUserDTO result = controller.getCurrentUser();
        assertThat(result.getId()).isEqualTo(user.getId());
        assertThat(result.getLogin()).isEqualTo(user.getLogin());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfNotFound() {
        when(mockUserDao.findById(userId)).thenReturn(Optional.empty());

        controller.getCurrentUser();
    }

    public static User createUser(Long id) {
        User user = new User(id);
        user.setLogin("JB");
        user.setPassword("hashedPassword");
        return user;
    }
}
