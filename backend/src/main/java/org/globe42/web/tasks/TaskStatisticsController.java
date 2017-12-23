package org.globe42.web.tasks;

import java.util.List;
import java.util.stream.Collectors;

import org.globe42.dao.SpentTimeDao;
import org.globe42.domain.SpentTimeStatistic;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller used to get statistics about tasks (spent times)
 * @author JB Nizet
 */
@RestController
@RequestMapping("/api/task-statistics")
public class TaskStatisticsController {

    private final SpentTimeDao spentTimeDao;

    public TaskStatisticsController(SpentTimeDao spentTimeDao) {
        this.spentTimeDao = spentTimeDao;
    }

    @GetMapping("spent-times")
    public SpentTimeStatisticsDTO spentTimeStatistics(SpentTimeStatisticsCriteriaDTO criteria) {
        List<SpentTimeStatistic> stats = spentTimeDao.findSpentTimeStatistics(criteria);
        return new SpentTimeStatisticsDTO(stats.stream().map(SpentTimeStatisticDTO::new).collect(Collectors.toList()));
    }
}
