package org.globe42.dao

import org.globe42.domain.Charge
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for the [Charge] entity
 * @author JB Nizet
 */
interface ChargeDao : JpaRepository<Charge, Long>
