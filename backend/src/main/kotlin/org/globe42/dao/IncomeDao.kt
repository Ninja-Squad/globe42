package org.globe42.dao

import org.globe42.domain.Income
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for the [Income] entity
 * @author JB Nizet
 */
interface IncomeDao : JpaRepository<Income, Long>
