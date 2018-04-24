package org.globe42.web.tasks;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Collections;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.SpentTimeDao;
import org.globe42.domain.SpentTimeStatistic;
import org.globe42.domain.TaskCategory;
import org.globe42.domain.User;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link TaskStatisticsController}
 * @author JB Nizet
 */
@GlobeMvcTest(TaskStatisticsController.class)
public class TaskStatisticsControllerMvcTest {

    @MockBean
    private SpentTimeDao mockSpentTimeDao;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldGetSpentTimeStatistics() throws Exception {
        SpentTimeStatisticsCriteriaDTO criteria = new SpentTimeStatisticsCriteriaDTO(LocalDate.of(2017, 12, 1),
                                                                                     LocalDate.of(2017, 12, 31));

        TaskCategory meal = new TaskCategory(6L, "Meal");
        User user = new User(1L, "jb");

        when(mockSpentTimeDao.findSpentTimeStatistics(criteria))
            .thenReturn(Collections.singletonList(new SpentTimeStatistic(meal, user, 100)));

        mvc.perform(get("/api/task-statistics/spent-times")
                        .param("from", criteria.getFromDate().toString())
                        .param("to", criteria.getToDate().toString()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.statistics.[0].user.login").value(user.getLogin()))
           .andExpect(jsonPath("$.statistics.[0].category.name").value(meal.getName()))
           .andExpect(jsonPath("$.statistics.[0].minutes").value(100));
    }
}
