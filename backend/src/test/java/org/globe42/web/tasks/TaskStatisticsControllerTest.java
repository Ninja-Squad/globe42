package org.globe42.web.tasks;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Collections;

import org.globe42.dao.SpentTimeDao;
import org.globe42.domain.SpentTimeStatistic;
import org.globe42.domain.TaskCategory;
import org.globe42.domain.User;
import org.globe42.test.BaseTest;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link TaskStatisticsController}
 * @author JB Nizet
 */
public class TaskStatisticsControllerTest extends BaseTest {
    @Mock
    private SpentTimeDao mockSpentTimeDao;

    @InjectMocks
    private TaskStatisticsController controller;

    @Test
    public void shouldGetStatistics() {
        SpentTimeStatisticsCriteriaDTO criteria = new SpentTimeStatisticsCriteriaDTO(null, null);

        TaskCategory meal = new TaskCategory(6L, "Meal");
        User user = new User(1L, "jb");
        when(mockSpentTimeDao.findSpentTimeStatistics(criteria))
            .thenReturn(Collections.singletonList(new SpentTimeStatistic(meal, user, 100)));

        SpentTimeStatisticsDTO result = controller.spentTimeStatistics(criteria);

        assertThat(result.getStatistics()).hasSize(1);
        SpentTimeStatisticDTO spentTimeStatisticDTO = result.getStatistics().get(0);
        assertThat(spentTimeStatisticDTO.getCategory().getId()).isEqualTo(meal.getId());
        assertThat(spentTimeStatisticDTO.getCategory().getName()).isEqualTo(meal.getName());
        assertThat(spentTimeStatisticDTO.getUser().getId()).isEqualTo(user.getId());
        assertThat(spentTimeStatisticDTO.getUser().getLogin()).isEqualTo(user.getLogin());
        assertThat(spentTimeStatisticDTO.getMinutes()).isEqualTo(100);
    }
}