package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A User of the application. Do not confuse with Person, which is a person helped by Globe 42.
 * @author JB Nizet
 */
@Entity
@Table(name = "GUSER")
public class User {
    private static final String USER_GENERATOR = "UserGenerator";

    @Id
    @SequenceGenerator(name = USER_GENERATOR, sequenceName = "GUSER_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = USER_GENERATOR)
    private Long id;

    @NotEmpty
    private String login;

    /**
     * The salted and hashed password, base64-encoded
     */
    @NotEmpty
    private String password;

    public User() {
    }

    public User(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
