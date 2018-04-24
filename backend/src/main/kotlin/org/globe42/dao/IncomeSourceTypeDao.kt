package org.globe42.dao

import java.util.Optional

import org.globe42.domain.IncomeSourceType
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for the [IncomeSourceType] entity
 * @author JB Nizet
 */
interface IncomeSourceTypeDao : JpaRepository<IncomeSourceType, Long> {
    fun existsByType(type: String): Boolean
    fun findByType(type: String): Optional<IncomeSourceType>
}
