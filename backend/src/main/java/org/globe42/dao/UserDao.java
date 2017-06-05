package org.globe42.dao;

import java.util.Optional;

import org.globe42.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for the {@link org.globe42.domain.User} entity
 * @author JB Nizet
 */
public interface UserDao extends JpaRepository<User, Long> {
    Optional<User> findByLogin(String login);
}
