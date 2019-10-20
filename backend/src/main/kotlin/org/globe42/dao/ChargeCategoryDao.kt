package org.globe42.dao

import org.globe42.domain.ChargeCategory

/**
 * DAO for the [ChargeCategory] entity
 * @author JB Nizet
 */
interface ChargeCategoryDao : GlobeRepository<ChargeCategory, Long> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): ChargeCategory?
}
