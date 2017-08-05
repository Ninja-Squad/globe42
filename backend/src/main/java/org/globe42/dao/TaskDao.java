package org.globe42.dao;

import java.time.LocalDate;

import org.globe42.domain.Person;
import org.globe42.domain.Task;
import org.globe42.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * DAO for {@link org.globe42.domain.Task}
 * @author JB Nizet
 */
public interface TaskDao extends JpaRepository<Task, Long> {
    @Query("select task from Task task"
        + " where task.status = org.globe42.domain.TaskStatus.TODO"
        + " order by task.dueDate, task.id")
    Page<Task> findTodo(Pageable page);

    @Query("select task from Task task"
           + " where task.status = org.globe42.domain.TaskStatus.TODO and task.assignee = :assignee"
           + " order by task.dueDate, task.id")
    Page<Task> findTodoByAssignee(@Param("assignee") User assignee, Pageable page);

    @Query("select task from Task task"
           + " where task.status = org.globe42.domain.TaskStatus.TODO and task.concernedPerson = :person"
           + " order by task.dueDate, task.id")
    Page<Task> findTodoByConcernedPerson(@Param("person") Person person, Pageable page);

    @Query("select task from Task task"
        + " where task.status = org.globe42.domain.TaskStatus.TODO and task.assignee is null"
        + " order by task.dueDate, task.id")
    Page<Task> findTodoUnassigned(Pageable page);

    @Query("select task from Task task"
        + " where task.status = org.globe42.domain.TaskStatus.TODO and task.dueDate <= :maxDate"
        + " order by task.dueDate, task.id")
    Page<Task> findTodoBefore(@Param("maxDate") LocalDate maxDate, Pageable page);

    @Query("update Task task set task.assignee = null where task.assignee = :user")
    @Modifying
    void resetAssigneeOnTasksAssignedTo(@Param("user") User user);

    @Query("update Task task set task.creator = null where task.creator = :user")
    @Modifying
    void resetCreatorOnTasksCreatedBy(@Param("user") User user);

    @Query("select task from Task task where task.status <> org.globe42.domain.TaskStatus.TODO"
           + " order by task.archivalInstant desc")
    Page<Task> findArchived(Pageable page);
}
