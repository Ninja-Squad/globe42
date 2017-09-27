package org.globe42.dao;

import java.util.Optional;

import org.globe42.domain.ChargeType;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for the {@link ChargeType} entity
 * @author JB Nizet
 */
public interface ChargeTypeDao extends JpaRepository<ChargeType, Long> {
    boolean existsByName(String name);
    Optional<ChargeType> findByName(String name);
}
