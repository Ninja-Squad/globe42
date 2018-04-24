package org.globe42.web.users;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Command sent to change the password of the current user
 * @author JB Nizet
 */
public final class ChangePasswordCommandDTO {
    @NotEmpty
    private String newPassword;

    @JsonCreator
    public ChangePasswordCommandDTO(@JsonProperty String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
