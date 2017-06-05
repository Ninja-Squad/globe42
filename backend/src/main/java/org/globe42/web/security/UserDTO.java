package org.globe42.web.security;

import org.globe42.domain.User;

/**
 * A user, with its JWT token
 * @author JB Nizet
 */
public final class UserDTO {
    private final String login;
    private final String token;

    public UserDTO(User user, String token) {
        this.login = user.getLogin();
        this.token = token;
    }

    public String getLogin() {
        return login;
    }

    public String getToken() {
        return token;
    }
}
