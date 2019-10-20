package org.globe42.dao

import org.globe42.domain.IncomeSource
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for the [IncomeSource] entity
 * @author JB Nizet
 */
interface IncomeSourceDao : JpaRepository<IncomeSource, Long> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): IncomeSource?
}
