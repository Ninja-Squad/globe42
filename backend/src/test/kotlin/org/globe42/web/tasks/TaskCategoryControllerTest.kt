package org.globe42.web.tasks

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Java6Assertions.assertThat
import org.globe42.dao.TaskCategoryDao
import org.globe42.domain.TaskCategory
import org.globe42.test.BaseTest
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock

/**
 * Unit tests for [TaskCategoryController]
 * @author JB Nizet
 */
class TaskCategoryControllerTest : BaseTest() {

    @Mock
    private lateinit var mockTaskCategoryDao: TaskCategoryDao

    @InjectMocks
    private lateinit var controller: TaskCategoryController

    @Test
    fun `should list`() {
        whenever(mockTaskCategoryDao.findAll()).thenReturn(listOf(TaskCategory(6L, "Various")))
        val result = controller.list()
        assertThat(result).containsExactly(TaskCategoryDTO(6L, "Various"))
    }
}