package org.globe42.web.tasks;

import java.time.LocalDate;

import org.globe42.domain.Task;
import org.globe42.domain.TaskStatus;
import org.globe42.web.persons.PersonIdentityDTO;
import org.globe42.web.users.UserDTO;

/**
 * DTO of a task
 * @author JB Nizet
 */
public final class TaskDTO {
    private final Long id;
    private final String description;
    private final String title;
    private final TaskStatus status;
    private final LocalDate dueDate;
    private final UserDTO creator;
    private final UserDTO assignee;
    private final PersonIdentityDTO concernedPerson;
    private final int totalSpentTimeInMinutes;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.description = task.getDescription();
        this.title = task.getTitle();
        this.status = task.getStatus();
        this.dueDate = task.getDueDate();
        this.creator = task.getCreator() == null ? null : new UserDTO(task.getCreator());
        this.assignee = task.getAssignee() == null ? null : new UserDTO(task.getAssignee());
        this.concernedPerson = task.getConcernedPerson() == null ? null : new PersonIdentityDTO(task.getConcernedPerson());
        this.totalSpentTimeInMinutes = task.getTotalSpentTimeInMinutes();
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getTitle() {
        return title;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public UserDTO getCreator() {
        return creator;
    }

    public UserDTO getAssignee() {
        return assignee;
    }

    public PersonIdentityDTO getConcernedPerson() {
        return concernedPerson;
    }

    public int getTotalSpentTimeInMinutes() {
        return totalSpentTimeInMinutes;
    }
}
