package org.globe42.web.tasks

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.eq
import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.dao.TaskCategoryDao
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.*
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.security.CurrentUser
import org.globe42.web.users.createUser
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDate
import java.util.*

/**
 * MVC tests for [TaskController]
 * @author JB Nizet
 */
@GlobeMvcTest(TaskController::class)
class TaskControllerMvcTest {

    @MockBean
    private lateinit var mockTaskDao: TaskDao

    @MockBean
    private lateinit var mockUserDao: UserDao

    @MockBean
    private lateinit var mockTaskCategoryDao: TaskCategoryDao

    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @MockBean
    private lateinit var mockCurrentUser: CurrentUser

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private lateinit var task: Task
    private lateinit var user: User

    @BeforeEach
    fun prepare() {
        val variousCategory = TaskCategory(VARIOUS_CATEGORY_ID, "Various")
        whenever(mockTaskCategoryDao.findById(variousCategory.id!!)).thenReturn(Optional.of(variousCategory))

        user = createUser(2L)
        task = createTask(23L, user, Person(45L, "John", "Doe", Gender.MALE), variousCategory)
    }

    @Test
    @Throws(Exception::class)
    fun `should list todos`() {
        whenever(mockTaskDao.findTodo(any<Pageable>())).thenReturn(singlePage(listOf(task)))

        mvc.perform(get("/api/tasks"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.content.[0].id").value(task.id!!.toInt()))
                .andExpect(jsonPath("$.content.[0].dueDate").value(task.dueDate.toString()))
    }

    @Test
    @Throws(Exception::class)
    fun `should list todo before`() {
        whenever(mockTaskDao.findTodoBefore(eq(LocalDate.of(2017, 8, 1)), any()))
                .thenReturn(singlePage(listOf(task)))

        mvc.perform(get("/api/tasks?before=2017-08-01"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.content[0].id").value(task.id!!.toInt()))
    }

    @Test
    @Throws(Exception::class)
    fun `should list todo for person`() {
        val person = Person(1L)
        whenever(mockPersonDao.getOne(1L)).thenReturn(person)
        whenever(mockTaskDao.findTodoByConcernedPerson(eq(person), any())).thenReturn(singlePage(listOf(task)))

        mvc.perform(get("/api/tasks?person=1"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.content[0].id").value(task.id!!.toInt()))
    }

    @Test
    @Throws(Exception::class)
    fun `should list archived for person`() {
        val person = Person(1L)
        whenever(mockPersonDao.getOne(1L)).thenReturn(person)
        whenever(mockTaskDao.findArchivedByConcernedPerson(eq(person), any())).thenReturn(singlePage(listOf(task)))

        mvc.perform(get("/api/tasks?person=1&archived"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.content[0].id").value(task.id!!.toInt()))
    }

    @Test
    @Throws(Exception::class)
    fun `should list unassigned`() {
        whenever(mockTaskDao.findTodoUnassigned(any())).thenReturn(singlePage(listOf(task)))

        mvc.perform(get("/api/tasks?unassigned"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.content[0].id").value(task.id!!.toInt()))
    }

    @Test
    @Throws(Exception::class)
    fun `should assign`() {
        whenever(mockTaskDao.findById(task.id!!)).thenReturn(Optional.of(task))
        val otherUser = User(5433L)
        whenever(mockUserDao.findNotDeletedById(otherUser.id!!)).thenReturn(Optional.of(otherUser))

        mvc.perform(post("/api/tasks/{taskId}/assignments", task.id)
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(TaskAssignmentCommandDTO(otherUser.id!!))))
                .andExpect(status().isCreated)

        assertThat(task.assignee).isEqualTo(otherUser)
    }

    @Test
    @Throws(Exception::class)
    fun `should change status`() {
        whenever(mockTaskDao.findById(task.id!!)).thenReturn(Optional.of(task))

        mvc.perform(post("/api/tasks/{taskId}/status-changes", task.id)
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(TaskStatusChangeCommandDTO(TaskStatus.DONE))))
                .andExpect(status().isCreated)

        assertThat(task.status).isEqualTo(TaskStatus.DONE)
    }

    @Test
    @Throws(Exception::class)
    fun `should create`() {
        val command = createCommand(null, null)

        whenever(mockCurrentUser.userId).thenReturn(user.id)
        whenever(mockUserDao.getOne(mockCurrentUser.userId!!)).thenReturn(user)
        whenever(mockTaskDao.save(any<Task>())).thenReturnModifiedFirstArgument<Task> { task -> task.id = 42L }

        mvc.perform(post("/api/tasks")
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.id").value(42))
    }

    @Test
    @Throws(Exception::class)
    fun `should update`() {
        val command = createCommand(null, null)
        whenever(mockTaskDao.findById(task.id!!)).thenReturn(Optional.of(task))

        mvc.perform(put("/api/tasks/{id}", task.id)
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isNoContent)
    }

    private fun singlePage(tasks: List<Task>): Page<Task> {
        return PageImpl(tasks, PageRequest.of(0, PAGE_SIZE), tasks.size.toLong())
    }
}