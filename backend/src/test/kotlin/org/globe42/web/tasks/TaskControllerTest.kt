package org.globe42.web.tasks

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.dao.TaskCategoryDao
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.Gender
import org.globe42.domain.Person
import org.globe42.domain.SpentTime
import org.globe42.domain.Task
import org.globe42.domain.TaskCategory
import org.globe42.domain.TaskStatus
import org.globe42.domain.User
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.globe42.web.users.createUser
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import java.time.LocalDate

/**
 * Unit tests for [TaskController]
 * @author JB Nizet
 */
class TaskControllerTest {

    private val mockTaskDao = mockk<TaskDao>()

    private val mockUserDao = mockk<UserDao>()

    private val mockPersonDao = mockk<PersonDao>()

    private val mockTaskCategoryDao = mockk<TaskCategoryDao>()

    private val mockCurrentUser = mockk<CurrentUser>()

    private val mockEventPublisher = mockk<ApplicationEventPublisher>(relaxUnitFun = true)

    private val controller = TaskController(
        mockTaskDao,
        mockUserDao,
        mockPersonDao,
        mockTaskCategoryDao,
        mockCurrentUser,
        mockEventPublisher
    )

    private lateinit var task1: Task
    private lateinit var task2: Task
    private lateinit var user: User
    private lateinit var variousCategory: TaskCategory
    private lateinit var mealCategory: TaskCategory

    @BeforeEach
    fun prepare() {
        user = createUser(1L)
        val person = Person(2L, "Jane", "Dean", Gender.FEMALE)

        variousCategory = TaskCategory(VARIOUS_CATEGORY_ID, "Various")
        every { mockTaskCategoryDao.findByIdOrNull(variousCategory.id!!) } returns variousCategory
        mealCategory = TaskCategory(10L, "Meal")
        every { mockTaskCategoryDao.findByIdOrNull(mealCategory.id!!) } returns mealCategory

        task1 = createTask(23L, user, person, mealCategory)

        task2 = Task(24L)
        task2.status = TaskStatus.TODO
        task2.description = "description2"
        task2.title = "title2"
        task2.category = variousCategory
        task2.creator = user
    }

    @Test
    fun `should list todo`() {
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        every { mockTaskDao.findTodo(pageRequest) } returns singlePage(listOf(task1, task2), pageRequest)

        val result = controller.listTodo(page = null)

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
        val dto = result.content[0]
        assertThat(dto.status).isEqualTo(task1.status)
        assertThat(dto.description).isEqualTo(task1.description)
        assertThat(dto.title).isEqualTo(task1.title)
        assertThat(dto.category.id).isEqualTo(task1.category.id)
        assertThat(dto.category.name).isEqualTo(task1.category.name)
        assertThat(dto.dueDate).isEqualTo(task1.dueDate)
        assertThat(dto.creator.id).isEqualTo(task1.creator.id)
        assertThat(dto.assignee!!.id).isEqualTo(task1.assignee!!.id)
        assertThat(dto.concernedPerson!!.id).isEqualTo(task1.concernedPerson!!.id)
    }

    @Test
    fun `should list unassigned`() {
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        every { mockTaskDao.findTodoUnassigned(pageRequest) } returns
            singlePage(listOf(task1, task2), pageRequest)

        val result = controller.listUnassigned(page = null)

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list mine`() {
        every { mockCurrentUser.userId } returns user.id
        every { mockUserDao.getReferenceById(user.id!!) } returns user

        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        every { mockTaskDao.findTodoByAssignee(user, pageRequest) } returns
            singlePage(listOf(task1, task2), pageRequest)

        val result = controller.listMine(page = null)

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list before`() {
        val maxDate = LocalDate.of(2017, 8, 4)
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        every { mockTaskDao.findTodoBefore(maxDate, pageRequest) } returns
            singlePage(listOf(task1, task2), pageRequest)

        val result = controller.listTodoBefore(maxDate, page = null)

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list todo for person`() {
        val person = Person(42L)
        every { mockPersonDao.getReferenceById(person.id!!) } returns person
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        every { mockTaskDao.findTodoByConcernedPerson(person, pageRequest) } returns
            singlePage(listOf(task1, task2), pageRequest)

        val result = controller.listTodoForPerson(person.id, page = null)

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list archived for person`() {
        val person = Person(42L)
        every { mockPersonDao.getReferenceById(person.id!!) } returns person
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        every { mockTaskDao.findArchivedByConcernedPerson(person, pageRequest) } returns
            singlePage(listOf(task1, task2), pageRequest)

        val result = controller.listArchivedForPerson(person.id, page = null)

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list archived`() {
        val pageRequest = PageRequest.of(2, PAGE_SIZE)
        every { mockTaskDao.findArchived(pageRequest) } returns
            PageImpl(listOf(task1, task2), pageRequest, 42)

        val result = controller.listArchived(2)

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
        assertThat(result.number).isEqualTo(2)
        assertThat(result.size).isEqualTo(PAGE_SIZE)
        assertThat(result.totalElements).isEqualTo(42)
        assertThat(result.totalPages).isEqualTo(3)
    }

    @Test
    fun `should assign`() {
        every { mockTaskDao.findByIdOrNull(task2.id!!) } returns task2
        every { mockUserDao.findNotDeletedById(user.id!!) } returns user

        controller.assign(task2.id!!, TaskAssignmentCommandDTO(user.id!!))

        assertThat(task2.assignee).isEqualTo(user)

        verify {
            mockEventPublisher.publishEvent(
                TaskAssignmentEvent(
                    taskId = task2.id!!,
                    newAssigneeId = user.id!!
                )
            )
        }
    }

    @Test
    fun `should assign without publishing event if new assignee is same as previous`() {
        task2.assignee = user
        every { mockTaskDao.findByIdOrNull(task2.id!!) } returns task2
        every { mockUserDao.findNotDeletedById(user.id!!) } returns user

        controller.assign(task2.id!!, TaskAssignmentCommandDTO(user.id!!))

        assertThat(task2.assignee).isEqualTo(user)

        verify(inverse = true) { mockEventPublisher.publishEvent(any()) }
    }

    @Test
    fun `should throw when assigning unexisting task`() {
        every { mockTaskDao.findByIdOrNull(task2.id!!) } returns null
        every { mockUserDao.findNotDeletedById(user.id!!) } returns user

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.assign(task2.id!!, TaskAssignmentCommandDTO(user.id!!))
        }
    }

    @Test
    fun `should throw when assigning to unexisting user`() {
        every { mockTaskDao.findByIdOrNull(task2.id!!) } returns task2
        every { mockUserDao.findNotDeletedById(user.id!!) } returns null

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy {
            controller.assign(task2.id!!, TaskAssignmentCommandDTO(user.id!!))
        }
    }

    @Test
    fun `should unassign`() {
        every { mockTaskDao.findByIdOrNull(task2.id!!) } returns task2

        controller.unassign(task2.id!!)

        assertThat(task2.assignee).isEqualTo(null)
    }

    @Test
    fun `should throw when unassigning unexisting task`() {
        every { mockTaskDao.findByIdOrNull(task2.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.unassign(task2.id!!) }
    }

    @Test
    fun `should change status`() {
        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns task1

        controller.changeStatus(task1.id!!, TaskStatusChangeCommandDTO(TaskStatus.DONE))

        assertThat(task1.status).isEqualTo(TaskStatus.DONE)
        assertThat(task1.archivalInstant).isNotNull()
    }

    @Test
    fun `should throw when changing status of unexisting task`() {
        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.changeStatus(task1.id!!, TaskStatusChangeCommandDTO(TaskStatus.DONE))
        }
    }

    @Test
    fun `should get`() {
        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns task1

        val (id) = controller.get(task1.id!!)

        assertThat(id).isEqualTo(task1.id!!)
    }

    @Test
    fun `should throw when getting unexisting task`() {
        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(task1.id!!) }
    }

    @Test
    fun `should create and publish event if assignment`() {
        val command = createCommand(12L, 13L)

        val person = Person(command.concernedPersonId!!, "John", "Doe", Gender.MALE)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        val user = User(command.assigneeId!!, "JB")
        every { mockUserDao.findNotDeletedById(user.id!!) } returns user

        every { mockCurrentUser.userId } returns user.id
        every { mockUserDao.getReferenceById(user.id!!) } returns user

        every { mockTaskDao.save(any<Task>()) } answers{ arg<Task>(0).apply { id = 42L } }

        val task = controller.create(command)
        assertThat(task.id).isEqualTo(42L)
        assertThat(task.title).isEqualTo(command.title)
        assertThat(task.category.id).isEqualTo(variousCategory.id)
        assertThat(task.description).isEqualTo(command.description?.trim())
        assertThat(task.dueDate).isEqualTo(command.dueDate)
        assertThat(task.concernedPerson!!.id).isEqualTo(person.id!!)
        assertThat(task.assignee!!.id).isEqualTo(user.id!!)

        verify {
            mockEventPublisher.publishEvent(
                TaskAssignmentEvent(
                    taskId = task.id,
                    newAssigneeId = user.id!!
                )
            )
        }
    }

    @Test
    fun `should create when null references passed in command`() {
        val command = createCommand(null, null)

        every { mockCurrentUser.userId } returns user.id
        every { mockUserDao.getReferenceById(user.id!!) } returns user
        every { mockTaskDao.save(any<Task>()) } answers { arg<Task>(0).apply { id = 42L } }

        val task = controller.create(command)
        assertThat(task.concernedPerson).isNull()
        assertThat(task.assignee).isNull()

        verify(inverse = true) { mockEventPublisher.publishEvent(any()) }
    }

    @Test
    fun `should create with blank description`() {
        val command = createCommand(null, null).copy(description = " ")

        every { mockCurrentUser.userId } returns user.id
        every { mockUserDao.getReferenceById(user.id!!) } returns user
        every { mockTaskDao.save(any<Task>()) } answers { arg<Task>(0).apply { id = 42L } }

        val task = controller.create(command)
        assertThat(task.description).isNull()
    }

    @Test
    fun `should update`() {
        val command = createCommand(12L, 13L)

        val person = Person(command.concernedPersonId!!, "Jack", "Black", Gender.MALE)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        val user = User(command.assigneeId!!)
        every { mockUserDao.findNotDeletedById(user.id!!) } returns user

        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns task1

        controller.update(task1.id!!, command)

        assertThat(task1.title).isEqualTo(command.title)
        assertThat(task1.description).isEqualTo(command.description)
        assertThat(task1.category.id).isEqualTo(command.categoryId)
        assertThat(task1.dueDate).isEqualTo(command.dueDate)
        assertThat(task1.concernedPerson!!.id).isEqualTo(person.id!!)
        assertThat(task1.assignee!!.id).isEqualTo(user.id!!)

        verify {
            mockEventPublisher.publishEvent(
                TaskAssignmentEvent(
                    taskId = task1.id!!,
                    newAssigneeId = command.assigneeId!!
                )
            )
        }
    }

    @Test
    fun `should not publish task assignment event when updating with same assignee`() {
        val command = createCommand(null, task1.assignee!!.id!!)

        every { mockUserDao.findNotDeletedById(user.id!!) } returns task1.assignee

        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns task1

        controller.update(task1.id!!, command)

        verify(inverse = true) { mockEventPublisher.publishEvent(any()) }
    }

    @Test
    fun `should list spent times`() {
        task1.addSpentTime(createSpentTime(1L, 10, user))
        task1.addSpentTime(createSpentTime(2L, 15, user))

        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns task1

        val result = controller.listSpentTimes(task1.id)
        assertThat(result).hasSize(2)
        val spentTime1 = result.find { it.id == 1L }!!
        assertThat(spentTime1.id).isEqualTo(user.id)
        assertThat(spentTime1.minutes).isEqualTo(10)
        assertThat(spentTime1.creationInstant).isNotNull()
    }

    @Test
    fun `should add spent time`() {
        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns task1
        every { mockCurrentUser.userId } returns user.id
        every { mockUserDao.getReferenceById(user.id!!) } returns user
        every { mockTaskDao.flush() } answers { task1.getSpentTimes().forEach { it.id = it.id ?: 76L } }

        val command = SpentTimeCommandDTO(10)
        val addedSpentTime = controller.addSpentTime(task1.id!!, command)

        assertThat(task1.getSpentTimes()).hasSize(1)
        assertThat(addedSpentTime.minutes).isEqualTo(10)
        assertThat(addedSpentTime.creator.id).isEqualTo(user.id!!)
    }

    @Test
    fun `should delete spent time`() {
        val spentTime = createSpentTime(1L, 10, user)
        task1.addSpentTime(spentTime)
        every { mockTaskDao.findByIdOrNull(task1.id!!) } returns task1
        controller.deleteSpentTime(task1.id!!, spentTime.id!!)
        assertThat(task1.getSpentTimes().isEmpty())

        controller.deleteSpentTime(task1.id!!, spentTime.id!!)
    }

    private fun singlePage(tasks: List<Task>, pageRequest: PageRequest): Page<Task> {
        return PageImpl(tasks, pageRequest, tasks.size.toLong())
    }
}

internal const val VARIOUS_CATEGORY_ID = 6L

internal fun createTask(id: Long?, user: User, person: Person, category: TaskCategory): Task {
    val task = Task()
    task.id = id
    task.status = TaskStatus.TODO
    task.description = " description "
    task.title = "title"
    task.category = category
    task.dueDate = LocalDate.of(2017, 8, 1)
    task.assignee = user
    task.creator = user
    task.concernedPerson = person

    return task
}

internal fun createCommand(concernedPersonId: Long?, assigneeId: Long?): TaskCommandDTO {
    return TaskCommandDTO(
        "new title",
        "new description",
        VARIOUS_CATEGORY_ID,
        LocalDate.now().plusDays(1),
        concernedPersonId,
        assigneeId
    )
}

internal fun createSpentTime(id: Long, minutes: Int, creator: User): SpentTime {
    val spentTime = SpentTime(id)
    spentTime.minutes = minutes
    spentTime.creator = creator
    return spentTime
}
