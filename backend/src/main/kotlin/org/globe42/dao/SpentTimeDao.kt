package org.globe42.dao

import org.globe42.domain.SpentTime
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for [SpentTime]
 * @author JB Nizet
 */
interface SpentTimeDao : JpaRepository<SpentTime, Long>, SpentTimeDaoCustom
