package org.globe42.web.users;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

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

    @JsonCreator
    public UserCommandDTO(@JsonProperty String login) {
        this.login = login;
    }

    public String getLogin() {
        return login;
    }
}
