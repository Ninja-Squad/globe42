package org.globe42.domain

import java.time.Instant
import java.time.LocalDate
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

private const val TASK_GENERATOR = "TaskGenerator"

/**
 * A task, which appears in the to-do list. When it's done, the task is simply being deleted.
 * @author JB Nizet
 */
@Entity
class Task {

    @Id
    @SequenceGenerator(name = TASK_GENERATOR, sequenceName = "TASK_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = TASK_GENERATOR)
    var id: Long? = null

    /**
     * The description of the task, which is free text describing what to do.
     */
    @NotEmpty
    var description: String? = null

    /**
     * A one-line title shortly describing the task, which appears in the to-do list.
     */
    @NotEmpty
    var title: String? = null

    @NotNull
    @ManyToOne
    var category: TaskCategory? = null

    /**
     * The status of the task. [TaskStatus.TODO] by default
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    var status = TaskStatus.TODO

    /**
     * The date before which the task should have been done. If null, it means there is no specific due date
     */
    var dueDate: LocalDate? = null

    /**
     * The user who created the task.
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    var creator: User? = null

    /**
     * The user that is assigned to the task.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    var assignee: User? = null

    /**
     * The person concerned by this task, i.e. for whom the task was created.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    var concernedPerson: Person? = null

    /**
     * The instant when the task was archived (marked as done or cancelled). Mainly used to be able to display latest
     * archived tasks first in the list, to resurrect them easily.
     */
    var archivalInstant: Instant? = null

    /**
     * The total spent time, in minutes, on this task. This value is recomputed every time a spent time is added or
     * delete for the task
     */
    var totalSpentTimeInMinutes: Int = 0
        private set

    /**
     * The list of time pieces spent on the task
     */
    @OneToMany(mappedBy = "task", cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    private val spentTimes: MutableSet<SpentTime> = HashSet<SpentTime>()

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    fun getSpentTimes(): Set<SpentTime> {
        return Collections.unmodifiableSet(spentTimes)
    }

    fun addSpentTime(spentTime: SpentTime) {
        spentTime.task = this
        this.spentTimes.add(spentTime)
        recomputeTotalSpentTime()
    }

    fun removeSpentTime(spentTime: SpentTime) {
        this.spentTimes.remove(spentTime)
        recomputeTotalSpentTime()
    }

    private fun recomputeTotalSpentTime() {
        this.totalSpentTimeInMinutes = this.spentTimes.stream().mapToInt(SpentTime::minutes).sum()
    }
}
