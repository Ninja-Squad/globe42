package org.globe42.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

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
     * A one-line title shortly describing the task, which appears in the to-do list.
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
    @ManyToOne(fetch = FetchType.LAZY)
    private User creator;

    /**
     * The user that is assigned to the task. If the user is deleted, the assignee will be set to null, to avoid losing tasks.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private User assignee;

    /**
     * The person concerned by this task, i.e. for whom the task was created.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private Person concernedPerson;

    /**
     * The instant when the task was archived (marked as done or cancelled). Mainly used to be able to display latest
     * archived tasks first in the list, to resurrect them easily.
     */
    private Instant archivalInstant;

    /**
     * The total spent time, in minutes, on this task. This value is recomputed every time a spent time is added or
     * delete for the task
     */
    private int totalSpentTimeInMinutes;

    /**
     * The list of time pieces spent on the task
     */
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SpentTime> spentTimes = new HashSet<>();

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

    public Instant getArchivalInstant() {
        return archivalInstant;
    }

    public void setArchivalInstant(Instant archivalInstant) {
        this.archivalInstant = archivalInstant;
    }

    public int getTotalSpentTimeInMinutes() {
        return totalSpentTimeInMinutes;
    }

    public Set<SpentTime> getSpentTimes() {
        return Collections.unmodifiableSet(spentTimes);
    }

    public void addSpentTime(SpentTime spentTime) {
        spentTime.setTask(this);
        this.spentTimes.add(spentTime);
        recomputeTotalSpentTime();
    }

    public void removeSpentTime(SpentTime spentTime) {
        this.spentTimes.remove(spentTime);
        recomputeTotalSpentTime();
    }

    private void recomputeTotalSpentTime() {
        this.totalSpentTimeInMinutes = this.spentTimes.stream().mapToInt(SpentTime::getMinutes).sum();
    }
}
