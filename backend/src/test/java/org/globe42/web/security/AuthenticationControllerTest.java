package org.globe42.web.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.UnauthorizedException;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for AuthenticationController
 * @author JB Nizet
 */
public class AuthenticationControllerTest extends BaseTest {
    @Mock
    private UserDao mockUserDao;

    @Mock
    private PasswordDigester mockPasswordDigester;

    @Mock
    private JwtHelper mockJwtHelper;

    @InjectMocks
    private AuthenticationController controller;

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowWhenUnknownUser() {
        CredentialsDTO credentials = createCredentials();

        when(mockUserDao.findByLogin(credentials.getLogin())).thenReturn(Optional.empty());

        controller.authenticate(credentials);
    }

    @Test(expected = UnauthorizedException.class)
    public void shouldThrowWhenPasswordDoesntMatch() {
        CredentialsDTO credentials = createCredentials();

        User user = createUser();
        when(mockUserDao.findByLogin(credentials.getLogin())).thenReturn(Optional.of(user));
        when(mockPasswordDigester.match(credentials.getPassword(), user.getPassword())).thenReturn(false);

        controller.authenticate(credentials);
    }

    @Test
    public void shouldAuthenticate() {
        CredentialsDTO credentials = createCredentials();

        User user = createUser();
        when(mockUserDao.findByLogin(credentials.getLogin())).thenReturn(Optional.of(user));
        when(mockPasswordDigester.match(credentials.getPassword(), user.getPassword())).thenReturn(true);
        String token = "token";
        when(mockJwtHelper.buildToken(user.getId())).thenReturn(token);
        UserDTO result = controller.authenticate(credentials);

        assertThat(result.getLogin()).isEqualTo(user.getLogin());
        assertThat(result.getToken()).isEqualTo(token);
    }

    public static CredentialsDTO createCredentials() {
        return new CredentialsDTO("JB", "passw0rd");
    }

    public static User createUser() {
        User user = new User(1L);
        user.setLogin("JB");
        user.setPassword("hashedPassword");
        return user;
    }
}
