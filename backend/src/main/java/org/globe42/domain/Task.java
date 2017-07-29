package org.globe42.domain;

import java.time.LocalDate;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A task, which appears in the to-do list. When it's done, the task is simply being deleted.
 * @author JB Nizet
 */
@Entity
public class Task {
    private static final String TASK_GENERATOR = "TaskGenerator";

    @Id
    @SequenceGenerator(name = TASK_GENERATOR, sequenceName = "TASK_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = TASK_GENERATOR)
    private Long id;

    /**
     * The description of the task, which is free text describing what to do.
     */
    @NotEmpty
    private String description;

    /**
     * A one-line title shortly describing th task, which appears in the to-do list.
     */
    @NotEmpty
    private String title;

    /**
     * The status of the task. {@link TaskStatus#TODO} by default
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.TODO;

    /**
     * The date before which the task should have been done. If null, it means there is no specific due date
     */
    private LocalDate dueDate;

    /**
     * The user who created the task. If the user is deleted, the creator will be set to null, to avoid losing tasks.
     */
    @ManyToOne
    private User creator;

    /**
     * The user that is assigned to the task. If the user is deleted, the assignee will be set to null, to avoid losing tasks.
     */
    @ManyToOne
    private User assignee;

    /**
     * The person concerned by this task, i.e. for whom the task was created.
     */
    @ManyToOne
    private Person concernedPerson;

    public Task() {
    }

    public Task(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public Person getConcernedPerson() {
        return concernedPerson;
    }

    public void setConcernedPerson(Person concernedPerson) {
        this.concernedPerson = concernedPerson;
    }
}
