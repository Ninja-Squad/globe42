package org.globe42.dao

import org.globe42.domain.IncomeSourceType

/**
 * DAO for the [IncomeSourceType] entity
 * @author JB Nizet
 */
interface IncomeSourceTypeDao : GlobeRepository<IncomeSourceType, Long> {
    fun existsByType(type: String): Boolean
    fun findByType(type: String): IncomeSourceType?
}
