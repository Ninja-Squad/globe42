package org.globe42.dao;

import java.util.Optional;

import org.globe42.domain.ChargeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for the {@link ChargeCategory} entity
 * @author JB Nizet
 */
public interface ChargeCategoryDao extends JpaRepository<ChargeCategory, Long> {
    boolean existsByName(String name);
    Optional<ChargeCategory> findByName(String name);
}
