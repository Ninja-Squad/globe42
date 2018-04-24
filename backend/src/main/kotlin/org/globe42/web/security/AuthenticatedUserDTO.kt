package org.globe42.web.security;

import org.globe42.domain.User;

/**
 * A user, with its JWT token
 * @author JB Nizet
 */
public final class AuthenticatedUserDTO {
    private Long id;
    private final String login;
    private final boolean admin;
    private final String token;

    public AuthenticatedUserDTO(User user, String token) {
        this.id = user.getId();
        this.login = user.getLogin();
        this.admin = user.isAdmin();
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public boolean isAdmin() {
        return admin;
    }

    public String getToken() {
        return token;
    }
}
