package org.globe42.domain;

import java.time.Instant;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * A piece of time spent on a given task
 * @author JB Nizet
 */
@Entity
public class SpentTime {
    private static final String SPENT_TIME_GENERATOR = "SpentTimeGenerator";

    @Id
    @SequenceGenerator(name = SPENT_TIME_GENERATOR, sequenceName = "SPENT_TIME_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = SPENT_TIME_GENERATOR)
    private Long id;

    /**
     * The number of minutes (always positive) spent on the task. The total time spent on the task is the sum of the
     * minutes of all the instances linked to a task. To speed things up however, this total is also recomputed
     * every time a spent time is added or deleted and stored directly in the task
     */
    @Min(1)
    private int minutes;

    /**
     * The task on which those minutes have been spent
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    private Task task;

    /**
     * The user which recorded this time spent on the task (another person might have spent the actual time).
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    private User creator;

    /**
     * The time when this spent time was created (might be later than the actual instant when the time was actually
     * spent)
     */
    @NotNull
    private Instant creationInstant = Instant.now();

    public SpentTime() {
    }

    public SpentTime(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getMinutes() {
        return minutes;
    }

    public void setMinutes(int minutes) {
        this.minutes = minutes;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Instant getCreationInstant() {
        return creationInstant;
    }

    public void setCreationInstant(Instant creationTime) {
        this.creationInstant = creationTime;
    }
}
