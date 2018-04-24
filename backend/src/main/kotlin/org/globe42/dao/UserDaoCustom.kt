package org.globe42.dao;

/**
 * Custom methods of {@link UserDao}
 * @author JB Nizet
 */
public interface UserDaoCustom {

    /**
     * Tests if a not deleted user with the given ID exists.
     * This method could be implemented based on {@link UserDao#findNotDeletedById(Long)}, but since
     * it's called at every request to check the authenticated user still exists, it's better to make
     * it as fast as possible
     */
    boolean existsNotDeletedById(Long userId);

    /**
     * Tests if a not deleted admin user with the given ID exists.
     * This method could be implemented based on {@link UserDao#findNotDeletedById(Long)}, but since
     * it's called at every request protected by the {@link org.globe42.web.security.AdminOnly} aspect to check the
     * authenticated user is an admin, it's better to make it as fast as possible
     */
    boolean existsNotDeletedAdminById(Long userId);
}
