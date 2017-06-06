package org.globe42.web.users;

import org.globe42.domain.User;

/**
 * Basic information about the current user
 * @author JB Nizet
 */
public final class CurrentUserDTO {
    private final Long id;
    private final String login;

    public CurrentUserDTO(User user) {
        this.id = user.getId();
        this.login = user.getLogin();
    }

    public Long getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }
}
