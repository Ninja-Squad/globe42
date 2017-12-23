package org.globe42.web.tasks;

import org.globe42.domain.SpentTimeStatistic;
import org.globe42.web.users.UserDTO;

/**
 * The number of minutes spent by a user on a task category
 * @author JB Nizet
 */
public final class SpentTimeStatisticDTO {
    private final TaskCategoryDTO category;
    private final UserDTO user;
    private final int minutes;

    public SpentTimeStatisticDTO(SpentTimeStatistic statistic) {
        this.category = new TaskCategoryDTO(statistic.getCategory());
        this.user = new UserDTO(statistic.getUser());
        this.minutes = statistic.getMinutes();
    }

    public TaskCategoryDTO getCategory() {
        return category;
    }

    public UserDTO getUser() {
        return user;
    }

    public int getMinutes() {
        return minutes;
    }
}
