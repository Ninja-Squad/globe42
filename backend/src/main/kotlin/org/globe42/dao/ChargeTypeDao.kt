package org.globe42.dao

import org.globe42.domain.ChargeType
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for the [ChargeType] entity
 * @author JB Nizet
 */
interface ChargeTypeDao : JpaRepository<ChargeType, Long> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): ChargeType?
}
