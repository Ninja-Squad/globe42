package org.globe42.web.tasks

import org.globe42.domain.TaskCategory

/**
 * DTO for [org.globe42.domain.TaskCategory]
 * @author JB Nizet
 */
data class TaskCategoryDTO(val id: Long, val name: String) {
    constructor(category: TaskCategory) : this(category.id!!, category.name!!)
}
