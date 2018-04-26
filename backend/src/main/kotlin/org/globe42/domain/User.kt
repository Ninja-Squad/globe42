package org.globe42.domain

import javax.persistence.*
import javax.validation.constraints.NotEmpty

const val USER_GENERATOR = "UserGenerator"

/**
 * A User of the application. Do not confuse with Person, which is a person helped by Globe 42.
 * @author JB Nizet
 */
@Entity
@Table(name = "GUSER")
class User {

    @Id
    @SequenceGenerator(name = USER_GENERATOR, sequenceName = "GUSER_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = USER_GENERATOR)
    var id: Long? = null

    @NotEmpty
    lateinit var login: String

    /**
     * The salted and hashed password, base64-encoded
     */
    @NotEmpty
    lateinit var password: String

    /**
     * Indicates that the user is an administrator. An administrator can manage other users, and access information
     * that regular users can't.
     */
    var admin: Boolean = false

    /**
     * Indicates that this user has been (logically) deleted. We keep the user in the database in order to remember
     * that he/she was the creator of tasks, notes, etc. But once deleted, a user doesn't appear in the list of users
     * anymore, and can't log in anymore.
     */
    var deleted: Boolean = false

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(id: Long, login: String) {
        this.id = id
        this.login = login
    }
}
