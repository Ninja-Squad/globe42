package org.globe42.dao;

import java.time.LocalDate;
import java.util.List;

import org.globe42.domain.Person;
import org.globe42.domain.Task;
import org.globe42.domain.User;
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
        + " where task.status = org.globe42.domain.TaskStatus.TODO")
    List<Task> findTodo();

    @Query("select task from Task task"
           + " where task.status = org.globe42.domain.TaskStatus.TODO and task.assignee = :assignee")
    List<Task> findTodoByAssignee(@Param("assignee") User assignee);

    @Query("select task from Task task"
           + " where task.status = org.globe42.domain.TaskStatus.TODO and task.concernedPerson = :person")
    List<Task> findTodoByConcernedPerson(@Param("person") Person person);

    @Query("select task from Task task"
        + " where task.status = org.globe42.domain.TaskStatus.TODO and task.assignee is null")
    List<Task> findTodoUnassigned();

    @Query("select task from Task task"
        + " where task.status = org.globe42.domain.TaskStatus.TODO and task.dueDate <= :maxDate")
    List<Task> findTodoBefore(@Param("maxDate") LocalDate maxDate);

    @Query("update Task task set task.assignee = null where task.assignee = :user")
    @Modifying
    void resetAssigneeOnTasksAssignedTo(@Param("user") User user);

    @Query("update Task task set task.creator = null where task.creator = :user")
    @Modifying
    void resetCreatorOnTasksCreatedBy(@Param("user") User user);
}
