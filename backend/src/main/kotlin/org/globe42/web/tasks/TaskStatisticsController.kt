package org.globe42.web.tasks

import org.globe42.dao.SpentTimeDao
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Controller used to get statistics about tasks (spent times)
 * @author JB Nizet
 */
@RestController
@RequestMapping("/api/task-statistics")
class TaskStatisticsController(private val spentTimeDao: SpentTimeDao) {

    @GetMapping("spent-times")
    fun spentTimeStatistics(criteria: SpentTimeStatisticsCriteriaDTO): SpentTimeStatisticsDTO {
        val stats = spentTimeDao.findSpentTimeStatistics(criteria)
        return SpentTimeStatisticsDTO(stats.map(::SpentTimeStatisticDTO))
    }
}
