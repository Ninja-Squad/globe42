package org.globe42.web.tasks

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.SpentTimeDao
import org.globe42.domain.SpentTimeStatistic
import org.globe42.domain.TaskCategory
import org.globe42.domain.User
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import java.time.LocalDate

/**
 * MVC tests for [TaskStatisticsController]
 * @author JB Nizet
 */
@GlobeMvcTest(TaskStatisticsController::class)
class TaskStatisticsControllerMvcTest(@Autowired private val mvc: MockMvc) {

    @MockkBean
    private lateinit var mockSpentTimeDao: SpentTimeDao

    @Test
    fun `should get spent time statistics`() {
        val criteria = SpentTimeStatisticsCriteriaDTO(
            LocalDate.of(2017, 12, 1),
            LocalDate.of(2017, 12, 31)
        )

        val meal = TaskCategory(6L, "Meal")
        val user = User(1L, "jb")

        every { mockSpentTimeDao.findSpentTimeStatistics(criteria) } returns
            listOf(SpentTimeStatistic(meal, user, 100))

        mvc.get("/api/task-statistics/spent-times") {
            param("from", criteria.from.toString())
            param("to", criteria.to.toString())
        }.andExpect {
            status { isOk() }
            jsonValue("$.statistics[0].user.login", user.login)
            jsonValue("$.statistics[0].category.name", meal.name)
            jsonValue("$.statistics[0].minutes", 100)
        }
    }
}
