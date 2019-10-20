package org.globe42.dao

import org.globe42.domain.IncomeSource

/**
 * DAO for the [IncomeSource] entity
 * @author JB Nizet
 */
interface IncomeSourceDao : GlobeRepository<IncomeSource, Long> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): IncomeSource?
}
