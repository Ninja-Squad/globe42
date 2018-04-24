package org.globe42.dao

import org.globe42.domain.Couple
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for [org.globe42.domain.Couple]
 * @author JB Nizet
 */
interface CoupleDao : JpaRepository<Couple, Long>
