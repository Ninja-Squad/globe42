package org.globe42.dao

/**
 * Custom methods of [UserDao]
 * @author JB Nizet
 */
interface UserDaoCustom {

    /**
     * Tests if a not deleted user with the given ID exists.
     * This method could be implemented based on [UserDao.findNotDeletedById], but since
     * it's called at every request to check the authenticated user still exists, it's better to make
     * it as fast as possible
     */
    fun existsNotDeletedById(userId: Long): Boolean

    /**
     * Tests if a not deleted admin user with the given ID exists.
     * This method could be implemented based on [UserDao.findNotDeletedById], but since
     * it's called at every request protected by the [org.globe42.web.security.AdminOnly] aspect to check the
     * authenticated user is an admin, it's better to make it as fast as possible
     */
    fun existsNotDeletedAdminById(userId: Long): Boolean
}
