package org.globe42.dao;

import org.globe42.domain.Income;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for the {@link Income} entity
 * @author JB Nizet
 */
public interface IncomeDao extends JpaRepository<Income, Long> {
}
