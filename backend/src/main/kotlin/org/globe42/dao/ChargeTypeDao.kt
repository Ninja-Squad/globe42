package org.globe42.dao

import org.globe42.domain.ChargeType

/**
 * DAO for the [ChargeType] entity
 * @author JB Nizet
 */
interface ChargeTypeDao : GlobeRepository<ChargeType, Long> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): ChargeType?
}
