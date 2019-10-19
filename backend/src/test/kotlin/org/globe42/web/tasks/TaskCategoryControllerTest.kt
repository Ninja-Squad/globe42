package org.globe42.web.tasks

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.TaskCategoryDao
import org.globe42.domain.TaskCategory
import org.junit.jupiter.api.Test

/**
 * Unit tests for [TaskCategoryController]
 * @author JB Nizet
 */
class TaskCategoryControllerTest {

    private val mockTaskCategoryDao = mockk<TaskCategoryDao>()

    private val controller = TaskCategoryController(mockTaskCategoryDao)

    @Test
    fun `should list`() {
        every { mockTaskCategoryDao.findAll() } returns listOf(TaskCategory(6L, "Various"))
        val result = controller.list()
        assertThat(result).containsExactly(TaskCategoryDTO(6L, "Various"))
    }
}
