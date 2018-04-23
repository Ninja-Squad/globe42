package org.globe42.web.tasks

import org.globe42.domain.SpentTimeStatistic
import org.globe42.web.users.UserDTO

/**
 * The number of minutes spent by a user on a task category
 * @author JB Nizet
 */
data class SpentTimeStatisticDTO(
    val category: TaskCategoryDTO,
    val user: UserDTO,
    val minutes: Int
) {

    constructor(statistic: SpentTimeStatistic) : this(
        TaskCategoryDTO(statistic.category),
        UserDTO(statistic.user),
        statistic.minutes
    )
}
