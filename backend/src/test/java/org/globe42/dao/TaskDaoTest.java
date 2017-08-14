package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.ninja_squad.dbsetup.Operations;
import com.ninja_squad.dbsetup.generator.ValueGenerators;
import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.FiscalStatus;
import org.globe42.domain.Gender;
import org.globe42.domain.Housing;
import org.globe42.domain.MaritalStatus;
import org.globe42.domain.HealthcareCover;
import org.globe42.domain.Person;
import org.globe42.domain.Task;
import org.globe42.domain.TaskStatus;
import org.globe42.domain.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * Tests for {@link TaskDao}
 * @author JB Nizet
 */
public class TaskDaoTest extends BaseDaoTest {

    @Autowired
    private TaskDao dao;

    @Before
    public void prepare() {
        Operation persons =
            Insert.into("person")
                  .withDefaultValue("fiscal_status_up_to_date", false)
                  .withDefaultValue("fiscal_status", FiscalStatus.UNKNOWN)
                  .withDefaultValue("marital_status", MaritalStatus.UNKNOWN)
                  .withDefaultValue("housing", Housing.UNKNOWN)
                  .withDefaultValue("healthcare_cover", HealthcareCover.UNKNOWN)
                  .columns("id", "first_name", "last_name", "gender", "adherent", "mediation_enabled")
                  .values(1L, "Cedric", "Exbrayat", Gender.MALE, true, false)
                  .build();

        Operation users = Insert.into("guser")
                                .columns("id", "login", "password", "admin")
                                .values(1L, "jb", "hashedPassword", true)
                                .values(2L, "ced", "hashedPassword", true)
                                .build();
        Operation tasks = Insert.into("task")
                                .withGeneratedValue("description", ValueGenerators.stringSequence("desc_"))
                                .withGeneratedValue("title", ValueGenerators.stringSequence("title_"))
                                .columns("id", "status", "due_date", "creator_id", "assignee_id", "concerned_person_id", "archival_instant")
                                .values(1L, TaskStatus.DONE, null, 1L, 1L, null, Instant.parse("2017-08-04T00:00:00Z"))
                                .values(2L, TaskStatus.TODO, null, 1L, 2L, null, null)
                                .values(3L, TaskStatus.TODO, null, 2L, 1L, null, null)
                                .values(4L, TaskStatus.TODO, LocalDate.of(2017, 8, 1), null, null, null, null)
                                .values(5L, TaskStatus.TODO, LocalDate.of(2017, 8, 7), null, null, 1L, null)
                                .values(6L, TaskStatus.CANCELLED, LocalDate.of(2017, 8, 1), null, null, 1L, Instant.parse("2017-08-04T12:00:00Z"))
                                .build();

        dbSetup(Operations.sequenceOf(users, persons, tasks));
    }

    @Test
    public void shouldFindTodo() {
        TRACKER.skipNextLaunch();
        assertThat(dao.findTodo(pageRequest()).getContent()).extracting(Task::getId).containsExactly(4L, 5L, 2L, 3L);
    }

    @Test
    public void shouldFindTodoByAssignee() {
        TRACKER.skipNextLaunch();
        assertThat(dao.findTodoByAssignee(new User(1L), pageRequest()).getContent()).extracting(Task::getId).containsExactly(3L);
    }

    @Test
    public void shouldFindTodoUnassigned() {
        TRACKER.skipNextLaunch();
        assertThat(dao.findTodoUnassigned(pageRequest()).getContent()).extracting(Task::getId).containsExactly(4L, 5L);
    }

    @Test
    public void shouldFindTodoBefore() {
        TRACKER.skipNextLaunch();
        assertThat(dao.findTodoBefore(LocalDate.of(2017, 8, 1), pageRequest()).getContent())
            .extracting(Task::getId).containsExactly(4L);
    }

    @Test
    public void shouldFindTodoForPerson() {
        TRACKER.skipNextLaunch();
        assertThat(dao.findTodoByConcernedPerson(new Person(1L), pageRequest()).getContent()).extracting(Task::getId).containsExactly(5L);
    }

    @Test
    public void shouldFindArchived() {
        TRACKER.skipNextLaunch();
        Page<Task> result = dao.findArchived(pageRequest());
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getTotalPages()).isEqualTo(1);
        assertThat(result.getContent()).extracting(Task::getId).containsExactly(6L, 1L);
    }

    @Test
    public void shouldResetCreator() {
        dao.resetCreatorOnTasksCreatedBy(new User(1L));
        List<Task> taskList = dao.findAll();
        assertThat(taskList.stream().filter(task -> task.getCreator() != null))
            .extracting(task -> task.getCreator().getId())
            .containsOnly(2L);
    }

    @Test
    public void shouldResetAssignee() {
        dao.resetAssigneeOnTasksAssignedTo(new User(1L));
        List<Task> taskList = dao.findAll();
        assertThat(taskList.stream().filter(task -> task.getAssignee() != null))
            .extracting(task -> task.getAssignee().getId())
            .containsOnly(2L);
    }

    PageRequest pageRequest() {
        return PageRequest.of(0, 20);
    }
}
