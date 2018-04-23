package org.globe42.web.tasks

import java.time.LocalDate
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

/**
 * Command used to create or edit a task
 * @author JB Nizet
 */
data class TaskCommandDTO(
    @field:NotEmpty val title: String,
    @field:NotEmpty val description: String,
    @field:NotNull val categoryId: Long,
    val dueDate: LocalDate?,
    val concernedPersonId: Long?,
    val assigneeId: Long?
)
