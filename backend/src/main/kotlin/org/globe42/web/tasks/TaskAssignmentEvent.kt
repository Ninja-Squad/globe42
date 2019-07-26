package org.globe42.web.tasks

/**
 * An event fired to signal that a task has been assigned to a user
 * @author JB Nizet
 */
data class TaskAssignmentEvent(
    val taskId: Long,
    val newAssigneeId: Long
)
