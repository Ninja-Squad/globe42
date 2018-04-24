package org.globe42.dao;

import java.util.List;
import java.util.Optional;

import org.globe42.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * DAO for the {@link org.globe42.domain.User} entity
 * @author JB Nizet
 */
public interface UserDao extends JpaRepository<User, Long>, UserDaoCustom {

    @Query("select u from User u where u.deleted = false")
    List<User> findNotDeleted();

    /**
     * Finds a not deleted user by login
     */
    @Query("select u from User u where u.login = :login and u.deleted = false")
    Optional<User> findNotDeletedByLogin(@Param("login") String login);

    /**
     * Tests if a user, deleted or not, has the given login
     */
    boolean existsByLogin(String login);

    /**
     * Finds a not deleted user by ID
     */
    default Optional<User> findNotDeletedById(Long id) {
        return this.findById(id).filter(user -> !user.isDeleted());
    }
}
