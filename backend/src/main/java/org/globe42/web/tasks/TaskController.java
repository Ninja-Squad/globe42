package org.globe42.web.tasks;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PersonDao;
import org.globe42.dao.TaskCategoryDao;
import org.globe42.dao.TaskDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.Person;
import org.globe42.domain.SpentTime;
import org.globe42.domain.Task;
import org.globe42.domain.TaskStatus;
import org.globe42.domain.User;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.CurrentUser;
import org.globe42.web.util.PageDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for tasks
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/tasks")
@Transactional
public class TaskController {

    static final int PAGE_SIZE = 20;

    private final TaskDao taskDao;
    private final UserDao userDao;
    private final PersonDao personDao;
    private final TaskCategoryDao taskCategoryDao;
    private final CurrentUser currentUser;

    public TaskController(TaskDao taskDao,
                          UserDao userDao,
                          PersonDao personDao,
                          TaskCategoryDao taskCategoryDao,
                          CurrentUser currentUser) {
        this.taskDao = taskDao;
        this.userDao = userDao;
        this.personDao = personDao;
        this.taskCategoryDao = taskCategoryDao;
        this.currentUser = currentUser;
    }

    @GetMapping
    public PageDTO<TaskDTO> listTodo(@RequestParam Optional<Integer> page) {
        return PageDTO.fromPage(taskDao.findTodo(pageRequest(page)), TaskDTO::new);
    }

    @GetMapping(params = "mine")
    public PageDTO<TaskDTO> listMine(@RequestParam Optional<Integer> page) {
        User user = userDao.getOne(currentUser.getUserId());
        return PageDTO.fromPage(taskDao.findTodoByAssignee(user, pageRequest(page)), TaskDTO::new);
    }

    @GetMapping(params = "unassigned")
    public PageDTO<TaskDTO> listUnassigned(@RequestParam Optional<Integer> page) {
        return PageDTO.fromPage(taskDao.findTodoUnassigned(pageRequest(page)), TaskDTO::new);
    }

    @GetMapping(params = "person")
    public PageDTO<TaskDTO> listForPerson(@RequestParam("person") Long personId, @RequestParam Optional<Integer> page) {
        Person person = personDao.getOne(personId);
        return PageDTO.fromPage(taskDao.findTodoByConcernedPerson(person, pageRequest(page)), TaskDTO::new);
    }

    @GetMapping(params = "before")
    public PageDTO<TaskDTO> listTodoBefore(@RequestParam("before") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                        @RequestParam Optional<Integer> page) {
        return PageDTO.fromPage(taskDao.findTodoBefore(date, pageRequest(page)), TaskDTO::new);
    }

    @GetMapping(params = "archived")
    public PageDTO<TaskDTO> listArchived(@RequestParam Optional<Integer> page) {
        return PageDTO.fromPage(taskDao.findArchived(pageRequest(page)), TaskDTO::new);
    }

    @GetMapping("/{taskId}")
    public TaskDTO get(@PathVariable("taskId") Long taskId) {
        return new TaskDTO(taskDao.findById(taskId).orElseThrow(NotFoundException::new));
    }

    @PostMapping("/{taskId}/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    public void assign(@PathVariable("taskId") Long taskId, @Validated @RequestBody TaskAssignmentCommandDTO command) {
        Task task = taskDao.findById(taskId).orElseThrow(() -> new NotFoundException("no task with ID " + taskId));
        User user = userDao.findNotDeletedById(command.getUserId()).orElseThrow(
            () -> new BadRequestException("user " + command.getUserId() + " doesn't exist"));

        task.setAssignee(user);
    }

    @DeleteMapping("/{taskId}/assignments")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unassign(@PathVariable("taskId") Long taskId) {
        Task task = taskDao.findById(taskId).orElseThrow(() -> new NotFoundException("no task with ID " + taskId));
        task.setAssignee(null);
    }

    @PostMapping("/{taskId}/status-changes")
    @ResponseStatus(HttpStatus.CREATED)
    public void changeStatus(@PathVariable("taskId") Long taskId, @Validated @RequestBody TaskStatusChangeCommandDTO command) {
        Task task = taskDao.findById(taskId).orElseThrow(() -> new NotFoundException("no task with ID " + taskId));
        task.setStatus(command.getNewStatus());
        if (command.getNewStatus() == TaskStatus.DONE || command.getNewStatus() == TaskStatus.CANCELLED) {
            task.setArchivalInstant(Instant.now());
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskDTO create(@Validated @RequestBody TaskCommandDTO command) {
        Task task = new Task();
        task.setCreator(userDao.getOne(currentUser.getUserId()));

        copyCommandToTask(command, task);

        return new TaskDTO(taskDao.save(task));
    }

    @PutMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable("taskId") Long taskId, @Validated @RequestBody TaskCommandDTO command) {
        Task task = taskDao.findById(taskId).orElseThrow(NotFoundException::new);
        copyCommandToTask(command, task);
    }

    @GetMapping("/{taskId}/spent-times")
    public List<SpentTimeDTO> listSpentTimes(@PathVariable("taskId") Long taskId) {
        Task task = taskDao.findById(taskId).orElseThrow(() -> new NotFoundException("no task with ID " + taskId));
        return task.getSpentTimes().stream().map(SpentTimeDTO::new).collect(Collectors.toList());
    }

    @PostMapping("/{taskId}/spent-times")
    @ResponseStatus(HttpStatus.CREATED)
    public SpentTimeDTO addSpentTime(@PathVariable("taskId") Long taskId, @Validated @RequestBody SpentTimeCommandDTO command) {
        Task task = taskDao.findById(taskId).orElseThrow(() -> new NotFoundException("no task with ID " + taskId));
        SpentTime spentTime = new SpentTime();
        spentTime.setCreator(userDao.getOne(currentUser.getUserId()));
        spentTime.setMinutes(command.getMinutes());

        task.addSpentTime(spentTime);
        taskDao.flush();
        return new SpentTimeDTO(spentTime);
    }

    @DeleteMapping("/{taskId}/spent-times/{spentTimeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSpentTime(@PathVariable("taskId") Long taskId, @PathVariable("spentTimeId") Long spentTimeId) {
        Task task = taskDao.findById(taskId).orElseThrow(() -> new NotFoundException("no task with ID " + taskId));
        task.getSpentTimes()
            .stream()
            .filter(st -> st.getId().equals(spentTimeId))
            .findAny()
            .ifPresent(task::removeSpentTime);
    }

    private void copyCommandToTask(TaskCommandDTO command, Task task) {
        task.setDescription(command.getDescription());
        task.setTitle(command.getTitle());
        task.setCategory(taskCategoryDao.findById(command.getCategoryId()).orElseThrow(
            () -> new BadRequestException("No category with ID " + command.getCategoryId())));
        task.setDueDate(command.getDueDate());
        Person concernedPerson = null;
        if (command.getConcernedPersonId() != null) {
            concernedPerson =
                personDao.findById(command.getConcernedPersonId())
                         .orElseThrow(() -> new BadRequestException("no person with id "+ command.getConcernedPersonId()));
        }
        task.setConcernedPerson(concernedPerson);

        User assignee = null;
        if (command.getAssigneeId() != null) {
            assignee =
                userDao.findNotDeletedById(command.getAssigneeId())
                       .orElseThrow(() -> new BadRequestException("no user with id "+ command.getAssigneeId()));
        }
        task.setAssignee(assignee);
    }

    private PageRequest pageRequest(@RequestParam Optional<Integer> page) {
        return PageRequest.of(page.orElse(0), PAGE_SIZE);
    }
}
