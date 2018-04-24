package org.globe42.domain

/**
 * The status of a task
 * @author JB Nizet
 */
enum class TaskStatus {
    /**
     * The task is still in the todo list
     */
    TODO,

    /**
     * The task has been cancelled. It's in the archive list, but can still be resurrected if the user messed up
     */
    CANCELLED,

    /**
     * The task has been mark as done. It's in the archive list, but can still be resurrected if the user messed up
     */
    DONE
}
