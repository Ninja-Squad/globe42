package org.globe42.web.tasks

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.dao.TaskCategoryDao
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.*
import org.globe42.test.GlobeMvcTest
import org.globe42.web.security.CurrentUser
import org.globe42.web.test.jsonValue
import org.globe42.web.users.createUser
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import java.time.LocalDate

/**
 * MVC tests for [TaskController]
 * @author JB Nizet
 */
@GlobeMvcTest(TaskController::class)
class TaskControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {

    @MockkBean
    private lateinit var mockTaskDao: TaskDao

    @MockkBean
    private lateinit var mockUserDao: UserDao

    @MockkBean
    private lateinit var mockTaskCategoryDao: TaskCategoryDao

    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    @MockkBean
    private lateinit var mockCurrentUser: CurrentUser

    private lateinit var task: Task
    private lateinit var user: User

    @BeforeEach
    fun prepare() {
        val variousCategory = TaskCategory(VARIOUS_CATEGORY_ID, "Various")
        every { mockTaskCategoryDao.findByIdOrNull(variousCategory.id!!) } returns variousCategory

        user = createUser(2L)
        task = createTask(23L, user, Person(45L, "John", "Doe", Gender.MALE), variousCategory)
    }

    @Test
    fun `should list todos`() {
        every { mockTaskDao.findTodo(any<Pageable>()) } returns singlePage(listOf(task))

        mvc.get("/api/tasks").andExpect {
            status { isOk }
            jsonValue("$.content.[0].id", task.id!!.toInt())
            jsonValue("$.content.[0].dueDate", task.dueDate.toString())
        }
    }

    @Test
    fun `should list todo before`() {
        every { mockTaskDao.findTodoBefore(eq(LocalDate.of(2017, 8, 1)), any()) } returns
            singlePage(listOf(task))

        mvc.get("/api/tasks?before=2017-08-01").andExpect {
            status { isOk }
            jsonValue("$.content[0].id", task.id!!.toInt())
        }
    }

    @Test
    fun `should list todo for person`() {
        val person = Person(1L)
        every { mockPersonDao.getOne(1L) } returns person
        every { mockTaskDao.findTodoByConcernedPerson(eq(person), any()) } returns singlePage(listOf(task))

        mvc.get("/api/tasks?person=1").andExpect {
            status { isOk }
            jsonValue("$.content[0].id", task.id!!.toInt())
        }
    }

    @Test
    fun `should list archived for person`() {
        val person = Person(1L)
        every { mockPersonDao.getOne(1L) } returns person
        every { mockTaskDao.findArchivedByConcernedPerson(eq(person), any()) } returns singlePage(listOf(task))

        mvc.get("/api/tasks?person=1&archived").andExpect {
            status { isOk }
            jsonValue("$.content[0].id", task.id!!.toInt())
        }
    }

    @Test
    fun `should list unassigned`() {
        every { mockTaskDao.findTodoUnassigned(any()) } returns singlePage(listOf(task))

        mvc.get("/api/tasks?unassigned").andExpect {
            status { isOk }
            jsonValue("$.content[0].id", task.id!!.toInt())
        }
    }

    @Test
    fun `should assign`() {
        every { mockTaskDao.findByIdOrNull(task.id!!) } returns task
        val otherUser = User(5433L)
        every { mockUserDao.findNotDeletedById(otherUser.id!!) } returns otherUser

        mvc.post("/api/tasks/{taskId}/assignments", task.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(TaskAssignmentCommandDTO(otherUser.id!!))
        }.andExpect {
            status { isCreated }
        }
        assertThat(task.assignee).isEqualTo(otherUser)
    }

    @Test
    fun `should change status`() {
        every { mockTaskDao.findByIdOrNull(task.id!!) } returns task

        mvc.post("/api/tasks/{taskId}/status-changes", task.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(TaskStatusChangeCommandDTO(TaskStatus.DONE))
        }.andExpect {
            status { isCreated }
        }
        assertThat(task.status).isEqualTo(TaskStatus.DONE)
    }

    @Test
    fun `should create`() {
        val command = createCommand(null, null)

        every { mockCurrentUser.userId } returns user.id
        every { mockUserDao.getOne(user.id!!) } returns user
        every { mockTaskDao.save(any<Task>()) } answers { arg<Task>(0).apply { id = 42L } }

        mvc.post("/api/tasks") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.id", 42)
        }
    }

    @Test
    fun `should update`() {
        val command = createCommand(null, null)
        every { mockTaskDao.findByIdOrNull(task.id!!) } returns task

        mvc.put("/api/tasks/{id}", task.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
    }

    private fun singlePage(tasks: List<Task>): Page<Task> {
        return PageImpl(tasks, PageRequest.of(0, PAGE_SIZE), tasks.size.toLong())
    }
}
