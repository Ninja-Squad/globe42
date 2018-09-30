package org.globe42.web.tasks

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.dao.TaskCategoryDao
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.*
import org.globe42.test.Mockito
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.globe42.web.users.createUser
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import java.time.LocalDate
import java.util.*

/**
 * Unit tests for [TaskController]
 * @author JB Nizet
 */
@Mockito
class TaskControllerTest {

    @Mock
    private lateinit var mockTaskDao: TaskDao

    @Mock
    private lateinit var mockUserDao: UserDao

    @Mock
    private lateinit var mockPersonDao: PersonDao

    @Mock
    private lateinit var mockTaskCategoryDao: TaskCategoryDao

    @Mock
    private lateinit var mockCurrentUser: CurrentUser

    @InjectMocks
    private lateinit var controller: TaskController

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
        whenever(mockTaskCategoryDao.findById(variousCategory.id!!)).thenReturn(Optional.of(variousCategory))
        mealCategory = TaskCategory(10L, "Meal")
        whenever(mockTaskCategoryDao.findById(mealCategory.id!!)).thenReturn(Optional.of(mealCategory))

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
        whenever(mockTaskDao.findTodo(pageRequest)).thenReturn(singlePage(listOf(task1, task2), pageRequest))

        val result = controller.listTodo(Optional.empty())

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
        whenever(mockTaskDao.findTodoUnassigned(pageRequest))
            .thenReturn(singlePage(listOf(task1, task2), pageRequest))

        val result = controller.listUnassigned(Optional.empty())

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list mine`() {
        whenever(mockCurrentUser.userId).thenReturn(user.id)
        whenever(mockUserDao.getOne(user.id!!)).thenReturn(user)

        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        whenever(mockTaskDao.findTodoByAssignee(user, pageRequest))
            .thenReturn(singlePage(listOf(task1, task2), pageRequest))

        val result = controller.listMine(Optional.empty())

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list before`() {
        val maxDate = LocalDate.of(2017, 8, 4)
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        whenever(mockTaskDao.findTodoBefore(maxDate, pageRequest))
            .thenReturn(singlePage(listOf(task1, task2), pageRequest))

        val result = controller.listTodoBefore(maxDate, Optional.empty())

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list todo for person`() {
        val person = Person(42L)
        whenever(mockPersonDao.getOne(person.id!!)).thenReturn(person)
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        whenever(mockTaskDao.findTodoByConcernedPerson(person, pageRequest))
            .thenReturn(singlePage(listOf(task1, task2), pageRequest))

        val result = controller.listTodoForPerson(person.id, Optional.empty())

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list archived for person`() {
        val person = Person(42L)
        whenever(mockPersonDao.getOne(person.id!!)).thenReturn(person)
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        whenever(mockTaskDao.findArchivedByConcernedPerson(person, pageRequest))
            .thenReturn(singlePage(listOf(task1, task2), pageRequest))

        val result = controller.listArchivedForPerson(person.id, Optional.empty())

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
    }

    @Test
    fun `should list archived`() {
        val pageRequest = PageRequest.of(2, PAGE_SIZE)
        whenever(mockTaskDao.findArchived(pageRequest))
            .thenReturn(PageImpl(listOf(task1, task2), pageRequest, 42))

        val result = controller.listArchived(Optional.of(2))

        assertThat(result.content).extracting<Long>(TaskDTO::id).containsExactly(task1.id, task2.id)
        assertThat(result.number).isEqualTo(2)
        assertThat(result.size).isEqualTo(PAGE_SIZE)
        assertThat(result.totalElements).isEqualTo(42)
        assertThat(result.totalPages).isEqualTo(3)
    }

    @Test
    fun `should assign`() {
        whenever(mockTaskDao.findById(task2.id!!)).thenReturn(Optional.of(task2))
        whenever(mockUserDao.findNotDeletedById(user.id!!)).thenReturn(Optional.of(user))

        controller.assign(task2.id!!, TaskAssignmentCommandDTO(user.id!!))

        assertThat(task2.assignee).isEqualTo(user)
    }

    @Test
    fun `should throw when assigning unexisting task`() {
        whenever(mockTaskDao.findById(task2.id!!)).thenReturn(Optional.empty())
        whenever(mockUserDao.findNotDeletedById(user.id!!)).thenReturn(Optional.of(user))

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.assign(task2.id!!, TaskAssignmentCommandDTO(user.id!!))
        }
    }

    @Test
    fun `should throw when assigning to unexisting user`() {
        whenever(mockTaskDao.findById(task2.id!!)).thenReturn(Optional.of(task2))
        whenever(mockUserDao.findNotDeletedById(user.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy {
            controller.assign(task2.id!!, TaskAssignmentCommandDTO(user.id!!))
        }
    }

    @Test
    fun `should unassign`() {
        whenever(mockTaskDao.findById(task2.id!!)).thenReturn(Optional.of(task2))

        controller.unassign(task2.id!!)

        assertThat(task2.assignee).isEqualTo(null)
    }

    @Test
    fun `should throw when unassigning unexisting task`() {
        whenever(mockTaskDao.findById(task2.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.unassign(task2.id!!) }
    }

    @Test
    fun `should change status`() {
        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.of(task1))

        controller.changeStatus(task1.id!!, TaskStatusChangeCommandDTO(TaskStatus.DONE))

        assertThat(task1.status).isEqualTo(TaskStatus.DONE)
        assertThat(task1.archivalInstant).isNotNull()
    }

    @Test
    fun `should throw when changing status of unexisting task`() {
        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.changeStatus(task1.id!!, TaskStatusChangeCommandDTO(TaskStatus.DONE))
        }
    }

    @Test
    fun `should get`() {
        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.of(task1))

        val (id) = controller.get(task1.id!!)

        assertThat(id).isEqualTo(task1.id!!)
    }

    @Test
    fun `should throw when getting unexisting task`() {
        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(task1.id!!) }
    }

    @Test
    fun `should create`() {
        val command = createCommand(12L, 13L)

        val person = Person(command.concernedPersonId!!, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        val user = User(command.assigneeId!!, "JB")
        whenever(mockUserDao.findNotDeletedById(user.id!!)).thenReturn(Optional.of(user))

        whenever(mockCurrentUser.userId).thenReturn(user.id)
        whenever(mockUserDao.getOne(mockCurrentUser.userId!!)).thenReturn(user)

        whenever(mockTaskDao.save(any<Task>())).thenReturnModifiedFirstArgument<Task> { task -> task.id = 42L }

        val task = controller.create(command)
        assertThat(task.id).isEqualTo(42L)
        assertThat(task.title).isEqualTo(command.title)
        assertThat(task.category.id).isEqualTo(variousCategory.id)
        assertThat(task.description).isEqualTo(command.description)
        assertThat(task.dueDate).isEqualTo(command.dueDate)
        assertThat(task.concernedPerson!!.id).isEqualTo(person.id!!)
        assertThat(task.assignee!!.id).isEqualTo(user.id!!)
    }

    @Test
    fun `should create when null references passed in command`() {
        val command = createCommand(null, null)

        whenever(mockCurrentUser.userId).thenReturn(user.id)
        whenever(mockUserDao.getOne(mockCurrentUser.userId!!)).thenReturn(user)
        whenever(mockTaskDao.save(any<Task>())).thenReturnModifiedFirstArgument<Task> { task -> task.id = 42L }

        val task = controller.create(command)
        assertThat(task.concernedPerson).isNull()
        assertThat(task.assignee).isNull()
    }

    @Test
    fun `should update`() {
        val command = createCommand(12L, 13L)

        val person = Person(command.concernedPersonId!!, "Jack", "Black", Gender.MALE)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        val user = User(command.assigneeId!!)
        whenever(mockUserDao.findNotDeletedById(user.id!!)).thenReturn(Optional.of(user))

        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.of(task1))

        controller.update(task1.id!!, command)

        assertThat(task1.title).isEqualTo(command.title)
        assertThat(task1.description).isEqualTo(command.description)
        assertThat(task1.category.id).isEqualTo(command.categoryId)
        assertThat(task1.dueDate).isEqualTo(command.dueDate)
        assertThat(task1.concernedPerson!!.id).isEqualTo(person.id!!)
        assertThat(task1.assignee!!.id).isEqualTo(user.id!!)
    }

    @Test
    fun `should list spent times`() {
        task1.addSpentTime(createSpentTime(1L, 10, user))
        task1.addSpentTime(createSpentTime(2L, 15, user))

        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.of(task1))

        val result = controller.listSpentTimes(task1.id)
        assertThat(result).hasSize(2)
        val spentTime1 = result.find { it.id == 1L }!!
        assertThat(spentTime1.id).isEqualTo(user.id)
        assertThat(spentTime1.minutes).isEqualTo(10)
        assertThat(spentTime1.creationInstant).isNotNull()
    }

    @Test
    fun `should add spent time`() {
        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.of(task1))
        whenever(mockCurrentUser.userId).thenReturn(user.id)
        whenever(mockUserDao.getOne(user.id!!)).thenReturn(user)
        whenever(mockTaskDao.flush()).thenAnswer { _ -> task1.getSpentTimes().forEach { it.id = it.id ?: 76L } }

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
        whenever(mockTaskDao.findById(task1.id!!)).thenReturn(Optional.of(task1))
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
    task.description = "description"
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
