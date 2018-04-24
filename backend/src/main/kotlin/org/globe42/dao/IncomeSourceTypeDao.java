package org.globe42.dao;

import java.util.Optional;

import org.globe42.domain.IncomeSourceType;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for the {@link IncomeSourceType} entity
 * @author JB Nizet
 */
public interface IncomeSourceTypeDao extends JpaRepository<IncomeSourceType, Long> {
    boolean existsByType(String type);
    Optional<IncomeSourceType> findByType(String type);
}
