package org.globe42.web.tasks

import org.globe42.dao.PersonDao
import org.globe42.dao.TaskCategoryDao
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.SpentTime
import org.globe42.domain.Task
import org.globe42.domain.TaskStatus
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.globe42.web.util.PageDTO
import org.globe42.web.util.toDTO
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.PageRequest
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.time.LocalDate
import javax.transaction.Transactional

const val PAGE_SIZE = 20

/**
 * REST controller for tasks
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/tasks"])
@Transactional
class TaskController(
    private val taskDao: TaskDao,
    private val userDao: UserDao,
    private val personDao: PersonDao,
    private val taskCategoryDao: TaskCategoryDao,
    private val currentUser: CurrentUser,
    private val eventPublisher: ApplicationEventPublisher
) {

    @GetMapping
    fun listTodo(@RequestParam page: Int?): PageDTO<TaskDTO> {
        return taskDao.findTodo(pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["mine"])
    fun listMine(@RequestParam page: Int?): PageDTO<TaskDTO> {
        val user = userDao.getOne(currentUser.userId!!)
        return taskDao.findTodoByAssignee(user, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["unassigned"])
    fun listUnassigned(@RequestParam page: Int?): PageDTO<TaskDTO> {
        return taskDao.findTodoUnassigned(pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["person"])
    fun listTodoForPerson(@RequestParam("person") personId: Long?, @RequestParam page: Int?): PageDTO<TaskDTO> {
        val person = personDao.getOne(personId!!)
        return taskDao.findTodoByConcernedPerson(person, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["person", "archived"])
    fun listArchivedForPerson(
        @RequestParam("person") personId: Long?,
        @RequestParam page: Int?
    ): PageDTO<TaskDTO> {
        val person = personDao.getOne(personId!!)
        return taskDao.findArchivedByConcernedPerson(person, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["before"])
    fun listTodoBefore(
        @RequestParam("before") date: LocalDate,
        @RequestParam page: Int?
    ): PageDTO<TaskDTO> {
        return taskDao.findTodoBefore(date, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["archived"])
    fun listArchived(@RequestParam page: Int?): PageDTO<TaskDTO> {
        return taskDao.findArchived(pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping("/{taskId}")
    fun get(@PathVariable("taskId") taskId: Long): TaskDTO {
        return taskDao.findByIdOrNull(taskId)
            ?.let(::TaskDTO)
            ?: throw NotFoundException()
    }

    @PostMapping("/{taskId}/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    fun assign(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: TaskAssignmentCommandDTO) {
        val task = taskDao.findByIdOrNull(taskId) ?: throw NotFoundException("no task with ID $taskId")
        val user = userDao.findNotDeletedById(command.userId)
            ?: throw BadRequestException("user ${command.userId} doesn't exist")

        val previousAssignee = task.assignee
        task.assignee = user

        if (task.assignee != previousAssignee) {
            eventPublisher.publishEvent(
                TaskAssignmentEvent(
                    taskId = task.id!!,
                    newAssigneeId = user.id!!
                )
            )
        }
    }

    @DeleteMapping("/{taskId}/assignments")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun unassign(@PathVariable("taskId") taskId: Long) {
        val task = taskDao.findByIdOrNull(taskId) ?: throw NotFoundException("no task with ID $taskId")
        task.assignee = null
    }

    @PostMapping("/{taskId}/status-changes")
    @ResponseStatus(HttpStatus.CREATED)
    fun changeStatus(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: TaskStatusChangeCommandDTO) {
        val task = taskDao.findByIdOrNull(taskId) ?: throw NotFoundException("no task with ID $taskId")
        task.status = command.newStatus
        if (command.newStatus === TaskStatus.DONE || command.newStatus === TaskStatus.CANCELLED) {
            task.archivalInstant = Instant.now()
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Validated @RequestBody command: TaskCommandDTO): TaskDTO {
        val task = Task()
        task.creator = userDao.getOne(currentUser.userId!!)

        copyCommandToTask(command, task)
        taskDao.save(task)

        task.assignee?.let { assignee ->
            eventPublisher.publishEvent(
                TaskAssignmentEvent(
                    taskId = task.id!!,
                    newAssigneeId = assignee.id!!
                )
            )
        }

        return TaskDTO(task)
    }

    @PutMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: TaskCommandDTO) {
        val task = taskDao.findByIdOrNull(taskId) ?: throw NotFoundException()

        val previousAssignee = task.assignee
        copyCommandToTask(command, task)
        task.assignee?.let { assignee ->
            if (assignee != previousAssignee) {
                eventPublisher.publishEvent(
                    TaskAssignmentEvent(
                        taskId = task.id!!,
                        newAssigneeId = assignee.id!!
                    )
                )
            }
        }
    }

    @GetMapping("/{taskId}/spent-times")
    fun listSpentTimes(@PathVariable("taskId") taskId: Long?): List<SpentTimeDTO> {
        val task = taskDao.findByIdOrNull(taskId!!) ?: throw NotFoundException("no task with ID $taskId")
        return task.getSpentTimes().map(::SpentTimeDTO)
    }

    @PostMapping("/{taskId}/spent-times")
    @ResponseStatus(HttpStatus.CREATED)
    fun addSpentTime(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: SpentTimeCommandDTO): SpentTimeDTO {
        val task = taskDao.findByIdOrNull(taskId) ?: throw NotFoundException("no task with ID $taskId")
        val spentTime = SpentTime()
        spentTime.creator = userDao.getOne(currentUser.userId!!)
        spentTime.minutes = command.minutes

        task.addSpentTime(spentTime)
        taskDao.flush()
        return SpentTimeDTO(spentTime)
    }

    @DeleteMapping("/{taskId}/spent-times/{spentTimeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteSpentTime(@PathVariable("taskId") taskId: Long, @PathVariable("spentTimeId") spentTimeId: Long) {
        val task = taskDao.findByIdOrNull(taskId) ?: throw NotFoundException("no task with ID $taskId")
        task.getSpentTimes()
            .stream()
            .filter { st -> st.id == spentTimeId }
            .findAny()
            .ifPresent { task.removeSpentTime(it) }
    }

    private fun copyCommandToTask(command: TaskCommandDTO, task: Task) {
        with(task) {
            description = command.description?.trim()?.takeIf { it.isNotEmpty() }
            title = command.title
            category = taskCategoryDao.findByIdOrNull(command.categoryId)
                ?: throw BadRequestException("No category with ID ${command.categoryId}")

            dueDate = command.dueDate
            concernedPerson = command.concernedPersonId?.let {
                personDao.findByIdOrNull(it) ?: throw BadRequestException("no person with id $it")
            }

            assignee = command.assigneeId?.let {
                userDao.findNotDeletedById(it) ?: throw BadRequestException("no user with id $it")
            }
        }
    }

    private fun pageRequest(page: Int?): PageRequest {
        return PageRequest.of(page ?: 0, PAGE_SIZE)
    }
}
