package org.globe42.dao;

import java.util.List;

import org.globe42.domain.SpentTimeStatistic;
import org.globe42.web.tasks.SpentTimeStatisticsCriteriaDTO;

/**
 * Custom methods of {@link SpentTimeDao}
 * @author JB Nizet
 */
public interface SpentTimeDaoCustom {
    List<SpentTimeStatistic> findSpentTimeStatistics(SpentTimeStatisticsCriteriaDTO criteria);
}
