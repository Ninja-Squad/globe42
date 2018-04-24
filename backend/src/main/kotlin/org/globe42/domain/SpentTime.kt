package org.globe42.domain

import java.time.Instant
import javax.persistence.*
import javax.validation.constraints.Min
import javax.validation.constraints.NotNull

private const val SPENT_TIME_GENERATOR = "SpentTimeGenerator"

/**
 * A piece of time spent on a given task
 * @author JB Nizet
 */
@Entity
class SpentTime {

    @Id
    @SequenceGenerator(name = SPENT_TIME_GENERATOR,
                       sequenceName = "SPENT_TIME_SEQ",
                       initialValue = 1000,
                       allocationSize = 1)
    @GeneratedValue(generator = SPENT_TIME_GENERATOR)
    var id: Long? = null

    /**
     * The number of minutes (always positive) spent on the task. The total time spent on the task is the sum of the
     * minutes of all the instances linked to a task. To speed things up however, this total is also recomputed
     * every time a spent time is added or deleted and stored directly in the task
     */
    @Min(1)
    var minutes: Int = 0

    /**
     * The task on which those minutes have been spent
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    var task: Task? = null

    /**
     * The user which recorded this time spent on the task (another person might have spent the actual time).
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    var creator: User? = null

    /**
     * The time when this spent time was created (might be later than the actual instant when the time was actually
     * spent)
     */
    @NotNull
    var creationInstant: Instant = Instant.now()

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
