package org.globe42.web.tasks

import org.globe42.domain.Task
import org.globe42.domain.TaskStatus
import org.globe42.web.persons.PersonIdentityDTO
import org.globe42.web.users.UserDTO
import java.time.LocalDate

/**
 * DTO of a task
 * @author JB Nizet
 */
data class TaskDTO(
    val id: Long,
    val description: String,
    val title: String,
    val category: TaskCategoryDTO,
    val status: TaskStatus,
    val dueDate: LocalDate?,
    val creator: UserDTO,
    val assignee: UserDTO?,
    val concernedPerson: PersonIdentityDTO?,
    val totalSpentTimeInMinutes: Int
) {

    constructor(task: Task) : this(
        task.id!!,
        task.description!!,
        task.title!!,
        TaskCategoryDTO(task.category!!),
        task.status,
        task.dueDate,
        UserDTO(task.creator!!),
        task.assignee?.let { UserDTO(it) },
        task.concernedPerson?.let { PersonIdentityDTO(it) },
        task.totalSpentTimeInMinutes
    )
}
