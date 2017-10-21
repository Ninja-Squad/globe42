package org.globe42.web.users;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Command passed to create or update a user
 * @author JB Nizet
 */
public final class UserCommandDTO {

    /**
     * The new login of the user.
     */
    @NotEmpty
    private final String login;

    /**
     * The new admin flag of the user.
     */
    private final boolean admin;

    @JsonCreator
    public UserCommandDTO(@JsonProperty String login,
                          @JsonProperty boolean admin) {
        this.login = login;
        this.admin = admin;
    }

    public String getLogin() {
        return login;
    }

    public boolean isAdmin() {
        return admin;
    }
}
