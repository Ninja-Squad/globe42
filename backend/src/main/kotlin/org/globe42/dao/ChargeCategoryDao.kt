package org.globe42.dao

import org.globe42.domain.ChargeCategory
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

/**
 * DAO for the [ChargeCategory] entity
 * @author JB Nizet
 */
interface ChargeCategoryDao : JpaRepository<ChargeCategory, Long> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): Optional<ChargeCategory>
}
