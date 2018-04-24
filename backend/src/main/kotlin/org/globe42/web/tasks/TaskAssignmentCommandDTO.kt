package org.globe42.web.tasks

import javax.validation.constraints.NotNull

/**
 * Command sent to assign a task to a user
 * @author JB Nizet
 */
data class TaskAssignmentCommandDTO(@field:NotNull val userId: Long)
