package org.globe42.dao;

import org.globe42.domain.IncomeSource;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for the {@link IncomeSource} entity
 * @author JB Nizet
 */
public interface IncomeSourceDao extends JpaRepository<IncomeSource, Long> {
}
