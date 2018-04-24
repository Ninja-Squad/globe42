package org.globe42.dao

import org.globe42.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

/**
 * DAO for the [org.globe42.domain.User] entity
 * @author JB Nizet
 */
interface UserDao : JpaRepository<User, Long>, UserDaoCustom {

    @Query("select u from User u where u.deleted = false")
    fun findNotDeleted(): List<User>

    /**
     * Finds a not deleted user by login
     */
    @Query("select u from User u where u.login = :login and u.deleted = false")
    fun findNotDeletedByLogin(@Param("login") login: String): Optional<User>

    /**
     * Tests if a user, deleted or not, has the given login
     */
    fun existsByLogin(login: String): Boolean

    /**
     * Finds a not deleted user by ID
     */
    @JvmDefault
    fun findNotDeletedById(id: Long): Optional<User> {
        return this.findById(id).filter { user -> !user.deleted }
    }
}
