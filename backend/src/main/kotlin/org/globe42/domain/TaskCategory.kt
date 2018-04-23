package org.globe42.domain

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.SequenceGenerator
import javax.validation.constraints.NotEmpty

private const val TASK_CATEGORY_GENERATOR = "TaskCategoryGenerator"

/**
 * A task category. Each task has one. This is basically en enum, but modifiable.
 * @author JB Nizet
 */
@Entity
class TaskCategory {

    @Id
    @SequenceGenerator(
        name = TASK_CATEGORY_GENERATOR,
        sequenceName = "TASK_CATEGORY_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = TASK_CATEGORY_GENERATOR)
    var id: Long? = null

    @NotEmpty
    var name: String? = null

    constructor(id: Long, name: String) {
        this.id = id
        this.name = name
    }

    constructor()
}
