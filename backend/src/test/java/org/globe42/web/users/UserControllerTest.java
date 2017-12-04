package org.globe42.web.users;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.NoteDao;
import org.globe42.dao.SpentTimeDao;
import org.globe42.dao.TaskDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.CurrentUser;
import org.globe42.web.security.PasswordDigester;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link UserController}
 * @author JB Nizet
 */
public class UserControllerTest extends BaseTest {
    @Mock
    private CurrentUser mockCurrentUser;

    @Mock
    private UserDao mockUserDao;

    @Mock
    private TaskDao mockTaskDao;

    @Mock
    private NoteDao mockNoteDao;

    @Mock
    private SpentTimeDao mockSpentTimeDao;

    @Mock
    private PasswordGenerator mockPasswordGenerator;

    @Mock
    private PasswordDigester mockPasswordDigester;

    @InjectMocks
    private UserController controller;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    private Long userId = 42L;

    @BeforeEach
    public void prepare() {
        when(mockCurrentUser.getUserId()).thenReturn(userId);
    }

    @Test
    public void shouldGetCurrentUser() {
        User user = createUser(userId);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        CurrentUserDTO result = controller.getCurrentUser();
        assertThat(result.getId()).isEqualTo(user.getId());
        assertThat(result.getLogin()).isEqualTo(user.getLogin());
    }

    @Test
    public void shouldThrowWhenGettingCurrentUserIfNotFound() {
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.getCurrentUser());
    }

    @Test
    public void shouldChangePasswordOfCurrentUser() {
        User user = createUser(userId);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        ChangePasswordCommandDTO command = new ChangePasswordCommandDTO("newPassword");
        when(mockPasswordDigester.hash(command.getNewPassword())).thenReturn("hashed");

        controller.changePassword(command);

        assertThat(user.getPassword()).isEqualTo("hashed");
    }

    @Test
    public void shouldList() {
        User user = createUser(userId);
        when(mockUserDao.findNotDeleted()).thenReturn(Collections.singletonList(user));

        List<UserDTO> result = controller.list();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(user.getId());
        assertThat(result.get(0).getLogin()).isEqualTo(user.getLogin());
    }

    @Test
    public void shouldGet() {
        User user = createUser(userId);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        UserDTO result = controller.get(userId);
        assertThat(result.getId()).isEqualTo(user.getId());
    }

    @Test
    public void shouldThrowWhenGettingIfNotFound() {
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.empty());
        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.get(userId));
    }

    @Test
    public void shouldCreate() {
        UserCommandDTO command = new UserCommandDTO("test", true);

        when(mockPasswordGenerator.generatePassword()).thenReturn("password");
        when(mockPasswordDigester.hash("password")).thenReturn("hashed");

        UserWithPasswordDTO result = controller.create(command);
        assertThat(result.getGeneratedPassword()).isEqualTo("password");
        assertThat(result.getUser().getLogin()).isEqualTo(command.getLogin());
        assertThat(result.getUser().isAdmin()).isEqualTo(command.isAdmin());

        verify(mockUserDao).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getPassword()).isEqualTo("hashed");
    }

    @Test
    public void shouldThrowWhenCreatingWithExistingLogin() {
        UserCommandDTO command = new UserCommandDTO("test", false);

        when(mockUserDao.existsByLogin(command.getLogin())).thenReturn(true);

        assertThatExceptionOfType(BadRequestException.class).isThrownBy(() -> controller.create(command));
    }

    @Test
    public void shouldUpdate() {
        UserCommandDTO command = new UserCommandDTO("test", true);
        User user = createUser(userId);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        controller.update(userId, command);
        assertThat(user.getLogin()).isEqualTo(command.getLogin());
        assertThat(user.isAdmin()).isEqualTo(command.isAdmin());
    }

    @Test
    public void shouldThrowWhenUpdatingWithExistingLogin() {
        UserCommandDTO command = new UserCommandDTO("test", false);
        User user = createUser(userId);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        when(mockUserDao.findNotDeletedByLogin(command.getLogin())).thenReturn(Optional.of(createUser(4567L)));

        assertThatExceptionOfType(BadRequestException.class).isThrownBy(() -> controller.update(userId, command));
    }

    @Test
    public void shouldNotThrowWhenUpdatingWithSameLogin() {
        User user = createUser(userId);
        UserCommandDTO command = new UserCommandDTO(user.getLogin(), false);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        when(mockUserDao.findNotDeletedByLogin(command.getLogin())).thenReturn(Optional.of(user));

        controller.update(userId, command);
    }

    @Test
    public void shouldDelete() {
        User user = createUser(userId);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        controller.delete(userId);

        assertThat(user.isDeleted()).isTrue();
    }

    @Test
    public void shouldNotDoAnythingWhenDeletingUnexistingUser() {
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.empty());

        controller.delete(userId);

        verify(mockUserDao, never()).delete(any(User.class));
    }

    @Test
    public void shouldResetPassword() {
        User user = createUser(userId);
        when(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user));

        when(mockPasswordGenerator.generatePassword()).thenReturn("password");
        when(mockPasswordDigester.hash("password")).thenReturn("hashed");
        UserWithPasswordDTO result = controller.resetPassword(userId);

        assertThat(user.getPassword()).isEqualTo("hashed");
        assertThat(result.getGeneratedPassword()).isEqualTo("password");
    }

    public static User createUser(Long id) {
        User user = new User(id);
        user.setLogin("JB");
        user.setPassword("hashedPassword");
        return user;
    }
}
