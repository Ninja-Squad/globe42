package org.globe42.web.tasks;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.globe42.dao.TaskCategoryDao;
import org.globe42.domain.TaskCategory;
import org.globe42.test.BaseTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link TaskCategoryController}
 * @author JB Nizet
 */
public class TaskCategoryControllerTest extends BaseTest {

    @Mock
    private TaskCategoryDao mockTaskCategoryDao;

    @InjectMocks
    private TaskCategoryController controller;

    @Test
    public void shouldList() {
        when(mockTaskCategoryDao.findAll()).thenReturn(Arrays.asList(new TaskCategory(6L, "Various")));
        List<TaskCategoryDTO> result = controller.list();
        assertThat(result).extracting(TaskCategoryDTO::getId).containsExactly(6L);
        assertThat(result).extracting(TaskCategoryDTO::getName).containsExactly("Various");
    }
}
