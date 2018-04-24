package org.globe42.dao

import org.globe42.domain.SpentTimeStatistic
import org.globe42.web.tasks.SpentTimeStatisticsCriteriaDTO

/**
 * Custom methods of [SpentTimeDao]
 * @author JB Nizet
 */
interface SpentTimeDaoCustom {
    fun findSpentTimeStatistics(criteria: SpentTimeStatisticsCriteriaDTO): List<SpentTimeStatistic>
}
