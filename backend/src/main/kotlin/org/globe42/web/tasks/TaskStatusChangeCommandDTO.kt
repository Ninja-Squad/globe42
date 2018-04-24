package org.globe42.web.tasks

import org.globe42.domain.TaskStatus
import javax.validation.constraints.NotNull

/**
 * Command sent to change the status of a task
 * @author JB Nizet
 */
data class TaskStatusChangeCommandDTO(@field:NotNull val newStatus: TaskStatus)
