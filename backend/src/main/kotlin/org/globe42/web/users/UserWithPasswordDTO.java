package org.globe42.web.users;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import org.globe42.domain.User;

/**
 * The information returned by a user creation. It contains a generated password, that must be transferred
 * to the actual user.
 * @author JB Nizet
 */
public final class UserWithPasswordDTO {

    @JsonUnwrapped
    private final UserDTO user;

    private final String generatedPassword;

    public UserWithPasswordDTO(User user, String generatedPassword) {
        this.user = new UserDTO(user);
        this.generatedPassword = generatedPassword;
    }

    public UserDTO getUser() {
        return user;
    }

    public String getGeneratedPassword() {
        return generatedPassword;
    }
}
