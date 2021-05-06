package org.globe42.dao

import org.globe42.domain.User
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

/**
 * DAO for the [org.globe42.domain.User] entity
 * @author JB Nizet
 */
interface UserDao : GlobeRepository<User, Long>, UserDaoCustom {

    @Query("select u from User u where u.deleted = false")
    fun findNotDeleted(): List<User>

    /**
     * Finds a not deleted user by login
     */
    @Query("select u from User u where u.login = :login and u.deleted = false")
    fun findNotDeletedByLogin(@Param("login") login: String): User?

    /**
     * Tests if a user, deleted or not, has the given login
     */
    fun existsByLogin(login: String): Boolean

    /**
     * Finds a not deleted user by ID
     */
    fun findNotDeletedById(id: Long): User? {
        return this.findByIdOrNull(id)?.takeIf { user -> !user.deleted }
    }
}
