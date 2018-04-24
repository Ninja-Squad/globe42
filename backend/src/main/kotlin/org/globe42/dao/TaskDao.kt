package org.globe42.dao

import java.time.LocalDate

import org.globe42.domain.Person
import org.globe42.domain.Task
import org.globe42.domain.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

/**
 * DAO for [org.globe42.domain.Task]
 * @author JB Nizet
 */
interface TaskDao : JpaRepository<Task, Long> {
    @Query("select task from Task task"
                   + " where task.status = org.globe42.domain.TaskStatus.TODO"
                   + " order by task.dueDate, task.id")
    fun findTodo(page: Pageable): Page<Task>

    @Query("select task from Task task"
                   + " where task.status = org.globe42.domain.TaskStatus.TODO and task.assignee = :assignee"
                   + " order by task.dueDate, task.id")
    fun findTodoByAssignee(@Param("assignee") assignee: User, page: Pageable): Page<Task>

    @Query("select task from Task task"
                   + " where task.status = org.globe42.domain.TaskStatus.TODO and task.concernedPerson = :person"
                   + " order by task.dueDate, task.id")
    fun findTodoByConcernedPerson(@Param("person") person: Person, page: Pageable): Page<Task>

    @Query("select task from Task task"
                   + " where task.status <> org.globe42.domain.TaskStatus.TODO and task.concernedPerson = :person"
                   + " order by task.archivalInstant desc")
    fun findArchivedByConcernedPerson(@Param("person") person: Person, page: Pageable): Page<Task>

    @Query("select task from Task task"
                   + " where task.status = org.globe42.domain.TaskStatus.TODO and task.assignee is null"
                   + " order by task.dueDate, task.id")
    fun findTodoUnassigned(page: Pageable): Page<Task>

    @Query("select task from Task task"
                   + " where task.status = org.globe42.domain.TaskStatus.TODO and task.dueDate <= :maxDate"
                   + " order by task.dueDate, task.id")
    fun findTodoBefore(@Param("maxDate") maxDate: LocalDate, page: Pageable): Page<Task>

    @Query("select task from Task task where task.status <> org.globe42.domain.TaskStatus.TODO" + " order by task.archivalInstant desc")
    fun findArchived(page: Pageable): Page<Task>
}
