package org.globe42.web.tasks;

import java.util.List;

/**
 * The statistics about spent times on tasks. Contains one element containing the number of minutes spent
 * by user and by category. This allows aggregating them to display the time spent by category, and also
 * displaying time spent by each user on each category
 * @author JB Nizet
 */
public class SpentTimeStatisticsDTO {
    private final List<SpentTimeStatisticDTO> statistics;

    public SpentTimeStatisticsDTO(List<SpentTimeStatisticDTO> statistics) {
        this.statistics = statistics;
    }

    public List<SpentTimeStatisticDTO> getStatistics() {
        return statistics;
    }
}
