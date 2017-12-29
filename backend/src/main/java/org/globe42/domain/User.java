package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;

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

    /**
     * Indicates that the user is an administrator. An administrator can manage other users, and access information
     * that regular users can't.
     */
    private boolean admin;

    /**
     * Indicates that this user has been (logically) deleted. We keep the user in the database in order to remember
     * that he/she was the creator of tasks, notes, etc. But once deleted, a user doesn't appear in the list of users
     * anymore, and can't log in anymore.
     */
    private boolean deleted;

    public User() {
    }

    public User(Long id) {
        this.id = id;
    }

    public User(Long id, String login) {
        this.id = id;
        this.login = login;
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

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
