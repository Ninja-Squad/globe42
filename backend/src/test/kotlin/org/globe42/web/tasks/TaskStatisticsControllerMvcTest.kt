package org.globe42.web.tasks

import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.SpentTimeDao
import org.globe42.domain.SpentTimeStatistic
import org.globe42.domain.TaskCategory
import org.globe42.domain.User
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDate

/**
 * MVC tests for [TaskStatisticsController]
 * @author JB Nizet
 */
@GlobeMvcTest(TaskStatisticsController::class)
class TaskStatisticsControllerMvcTest {

    @MockBean
    private lateinit var mockSpentTimeDao: SpentTimeDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun shouldGetSpentTimeStatistics() {
        val criteria = SpentTimeStatisticsCriteriaDTO(LocalDate.of(2017, 12, 1),
                                                      LocalDate.of(2017, 12, 31))

        val meal = TaskCategory(6L, "Meal")
        val user = User(1L, "jb")

        whenever(mockSpentTimeDao.findSpentTimeStatistics(criteria))
                .thenReturn(listOf(SpentTimeStatistic(meal, user, 100)))

        mvc.perform(get("/api/task-statistics/spent-times")
                              .param("from", criteria.from.toString())
                              .param("to", criteria.to.toString()))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.statistics[0].user.login").value(user.login!!))
                .andExpect(jsonPath("$.statistics[0].category.name").value(meal.name!!))
                .andExpect(jsonPath("$.statistics[0].minutes").value(100))
    }
}
