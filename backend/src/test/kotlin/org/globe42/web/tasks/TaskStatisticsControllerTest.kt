package org.globe42.web.tasks

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.SpentTimeDao
import org.globe42.domain.SpentTimeStatistic
import org.globe42.domain.TaskCategory
import org.globe42.domain.User
import org.junit.jupiter.api.Test

/**
 * Unit tests for [TaskStatisticsController]
 * @author JB Nizet
 */
class TaskStatisticsControllerTest {

    private val mockSpentTimeDao = mockk<SpentTimeDao>()

    private val controller = TaskStatisticsController(mockSpentTimeDao)

    @Test
    fun `should get statistics`() {
        val criteria = SpentTimeStatisticsCriteriaDTO(null, null)

        val meal = TaskCategory(6L, "Meal")
        val user = User(1L, "jb")
        every { mockSpentTimeDao.findSpentTimeStatistics(criteria) } returns
            listOf(SpentTimeStatistic(meal, user, 100))

        val result = controller.spentTimeStatistics(criteria)

        assertThat(result.statistics).hasSize(1)
        val stat = result.statistics[0]
        assertThat(stat.category.id).isEqualTo(meal.id)
        assertThat(stat.category.name).isEqualTo(meal.name)
        assertThat(stat.user.id).isEqualTo(user.id)
        assertThat(stat.user.login).isEqualTo(user.login)
        assertThat(stat.minutes).isEqualTo(100)
    }
}
