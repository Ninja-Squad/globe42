package org.globe42.dao

import org.globe42.domain.SpentTime

/**
 * DAO for [SpentTime]
 * @author JB Nizet
 */
interface SpentTimeDao : GlobeRepository<SpentTime, Long>, SpentTimeDaoCustom
