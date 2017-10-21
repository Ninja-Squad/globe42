package org.globe42.web.security;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Credentials sent by a user to authenticate
 * @author JB Nizet
 */
public final class CredentialsDTO {
    @NotEmpty
    private final String login;

    /**
     * The password, in clear text.
     */
    @NotEmpty
    private final String password;

    @JsonCreator
    public CredentialsDTO(@JsonProperty String login, @JsonProperty String password) {
        this.login = login;
        this.password = password;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }
}
