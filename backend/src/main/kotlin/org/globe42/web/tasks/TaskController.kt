package org.globe42.web.tasks

import org.globe42.dao.PersonDao
import org.globe42.dao.TaskCategoryDao
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.*
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.globe42.web.util.PageDTO
import org.globe42.web.util.toDTO
import org.springframework.data.domain.PageRequest
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.time.LocalDate
import java.util.*
import javax.transaction.Transactional

const val PAGE_SIZE = 20

/**
 * REST controller for tasks
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/tasks"])
@Transactional
class TaskController(private val taskDao: TaskDao,
                     private val userDao: UserDao,
                     private val personDao: PersonDao,
                     private val taskCategoryDao: TaskCategoryDao,
                     private val currentUser: CurrentUser) {

    @GetMapping
    fun listTodo(@RequestParam page: Optional<Int>): PageDTO<TaskDTO> {
        return taskDao.findTodo(pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["mine"])
    fun listMine(@RequestParam page: Optional<Int>): PageDTO<TaskDTO> {
        val user = userDao.getOne(currentUser.userId!!)
        return taskDao.findTodoByAssignee(user, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["unassigned"])
    fun listUnassigned(@RequestParam page: Optional<Int>): PageDTO<TaskDTO> {
        return taskDao.findTodoUnassigned(pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["person"])
    fun listTodoForPerson(@RequestParam("person") personId: Long?, @RequestParam page: Optional<Int>): PageDTO<TaskDTO> {
        val person = personDao.getOne(personId!!)
        return taskDao.findTodoByConcernedPerson(person, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["person", "archived"])
    fun listArchivedForPerson(@RequestParam("person") personId: Long?,
                              @RequestParam page: Optional<Int>): PageDTO<TaskDTO> {
        val person = personDao.getOne(personId!!)
        return taskDao.findArchivedByConcernedPerson(person, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["before"])
    fun listTodoBefore(@RequestParam("before") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
                       @RequestParam page: Optional<Int>): PageDTO<TaskDTO> {
        return taskDao.findTodoBefore(date, pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping(params = ["archived"])
    fun listArchived(@RequestParam page: Optional<Int>): PageDTO<TaskDTO> {
        return taskDao.findArchived(pageRequest(page)).toDTO(::TaskDTO)
    }

    @GetMapping("/{taskId}")
    fun get(@PathVariable("taskId") taskId: Long): TaskDTO {
        return TaskDTO(taskDao.findById(taskId).orElseThrow { NotFoundException() })
    }

    @PostMapping("/{taskId}/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    fun assign(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: TaskAssignmentCommandDTO) {
        val task = taskDao.findById(taskId).orElseThrow { NotFoundException("no task with ID $taskId") }
        val user = userDao.findNotDeletedById(command.userId).orElseThrow {
            BadRequestException("user ${command.userId} doesn't exist")
        }

        task.assignee = user
    }

    @DeleteMapping("/{taskId}/assignments")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun unassign(@PathVariable("taskId") taskId: Long) {
        val task = taskDao.findById(taskId).orElseThrow { NotFoundException("no task with ID $taskId") }
        task.assignee = null
    }

    @PostMapping("/{taskId}/status-changes")
    @ResponseStatus(HttpStatus.CREATED)
    fun changeStatus(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: TaskStatusChangeCommandDTO) {
        val task = taskDao.findById(taskId).orElseThrow { NotFoundException("no task with ID $taskId") }
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

        return TaskDTO(taskDao.save(task))
    }

    @PutMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: TaskCommandDTO) {
        val task = taskDao.findById(taskId).orElseThrow { NotFoundException() }
        copyCommandToTask(command, task)
    }

    @GetMapping("/{taskId}/spent-times")
    fun listSpentTimes(@PathVariable("taskId") taskId: Long?): List<SpentTimeDTO> {
        val task = taskDao.findById(taskId!!).orElseThrow { NotFoundException("no task with ID $taskId") }
        return task.getSpentTimes().map(::SpentTimeDTO)
    }

    @PostMapping("/{taskId}/spent-times")
    @ResponseStatus(HttpStatus.CREATED)
    fun addSpentTime(@PathVariable("taskId") taskId: Long, @Validated @RequestBody command: SpentTimeCommandDTO): SpentTimeDTO {
        val task = taskDao.findById(taskId).orElseThrow { NotFoundException("no task with ID $taskId") }
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
        val task = taskDao.findById(taskId).orElseThrow { NotFoundException("no task with ID $taskId") }
        task.getSpentTimes()
                .stream()
                .filter { st -> st.id == spentTimeId }
                .findAny()
                .ifPresent { task.removeSpentTime(it) }
    }

    private fun copyCommandToTask(command: TaskCommandDTO, task: Task) {
        task.description = command.description
        task.title = command.title
        task.category = taskCategoryDao.findById(command.categoryId).orElseThrow {
            BadRequestException("No category with ID ${command.categoryId}")
        }

        task.dueDate = command.dueDate
        var concernedPerson: Person? = null
        if (command.concernedPersonId != null) {
            concernedPerson = personDao.findById(command.concernedPersonId).orElseThrow {
                BadRequestException("no person with id ${command.concernedPersonId}")
            }
        }
        task.concernedPerson = concernedPerson

        var assignee: User? = null
        if (command.assigneeId != null) {
            assignee = userDao.findNotDeletedById(command.assigneeId).orElseThrow {
                BadRequestException("no user with id ${command.assigneeId}")
            }
        }
        task.assignee = assignee
    }

    private fun pageRequest(@RequestParam page: Optional<Int>): PageRequest {
        return PageRequest.of(page.orElse(0), PAGE_SIZE)
    }
}
