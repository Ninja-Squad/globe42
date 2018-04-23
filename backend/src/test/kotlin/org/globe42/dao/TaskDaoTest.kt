package org.globe42.dao

import com.ninja_squad.dbsetup.generator.ValueGenerators
import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import java.time.Instant
import java.time.LocalDate

/**
 * Tests for [TaskDao]
 * @author JB Nizet
 */
class TaskDaoTest : BaseDaoTest() {

    @Autowired
    private lateinit var dao: TaskDao

    @BeforeEach
    fun prepare() {
        setup {
            insertInto("person") {
                withDefaultValue("fiscal_status_up_to_date", false)
                withDefaultValue("fiscal_status", FiscalStatus.UNKNOWN)
                withDefaultValue("marital_status", MaritalStatus.UNKNOWN)
                withDefaultValue("housing", Housing.UNKNOWN)
                withDefaultValue("health_care_coverage", HealthCareCoverage.UNKNOWN)
                withDefaultValue("deleted", false)
                columns("id", "first_name", "last_name", "gender", "adherent", "mediation_enabled")
                values(1L, "Cedric", "Exbrayat", Gender.MALE, true, false)
            }

            insertInto("guser") {
                columns("id", "login", "password", "admin", "deleted")
                values(1L, "jb", "hashedPassword", true, false)
                values(2L, "ced", "hashedPassword", true, false)
                values(3L, "old", "hashedPassword", true, true)
            }

            insertInto("task") {
                withGeneratedValue("description", ValueGenerators.stringSequence("desc_"))
                withGeneratedValue("title", ValueGenerators.stringSequence("title_"))
                withDefaultValue("total_spent_time_in_minutes", 0)
                withDefaultValue("category_id", 6L)
                columns(
                    "id",
                    "status",
                    "due_date",
                    "creator_id",
                    "assignee_id",
                    "concerned_person_id",
                    "archival_instant"
                )
                values(1L, TaskStatus.DONE, null, 1L, 1L, null, Instant.parse("2017-08-04T00:00:00Z"))
                values(2L, TaskStatus.TODO, null, 1L, 2L, null, null)
                values(3L, TaskStatus.TODO, null, 2L, 1L, null, null)
                values(4L, TaskStatus.TODO, LocalDate.of(2017, 8, 1), 3L, null, null, null)
                values(5L, TaskStatus.TODO, LocalDate.of(2017, 8, 7), 3L, null, 1L, null)
                values(
                    6L,
                    TaskStatus.CANCELLED,
                    LocalDate.of(2017, 8, 1),
                    3L,
                    null,
                    1L,
                    Instant.parse("2017-08-04T12:00:00Z")
                )
            }
        }
    }

    @Test
    fun `should find todo`() {
        skipNextLaunch()
        assertThat(dao.findTodo(pageRequest()).content)
            .extracting<Long>(Task::id)
            .containsExactly(4L, 5L, 2L, 3L)
    }

    @Test
    fun `should find todo by assignee`() {
        skipNextLaunch()
        assertThat(dao.findTodoByAssignee(User(1L), pageRequest()).content)
            .extracting<Long>(Task::id)
            .containsExactly(3L)
    }

    @Test
    fun `should find todo unassigned`() {
        skipNextLaunch()
        assertThat(dao.findTodoUnassigned(pageRequest()).content).extracting<Long>(Task::id).containsExactly(4L, 5L)
    }

    @Test
    fun `should find todo before`() {
        skipNextLaunch()
        assertThat(dao.findTodoBefore(LocalDate.of(2017, 8, 1), pageRequest()).content)
            .extracting<Long>(Task::id)
            .containsExactly(4L)
    }

    @Test
    fun `should find todo for person`() {
        skipNextLaunch()
        assertThat(dao.findTodoByConcernedPerson(Person(1L), pageRequest()).content)
            .extracting<Long>(Task::id)
            .containsExactly(5L)
    }

    @Test
    fun `should find archived for person`() {
        skipNextLaunch()
        assertThat(dao.findArchivedByConcernedPerson(Person(1L), pageRequest()).content)
            .extracting<Long>(Task::id)
            .containsExactly(6L)
    }

    @Test
    fun `should find archived`() {
        skipNextLaunch()
        val result = dao.findArchived(pageRequest())
        assertThat(result.totalElements).isEqualTo(2)
        assertThat(result.totalPages).isEqualTo(1)
        assertThat(result.content).extracting<Long>(Task::id).containsExactly(6L, 1L)
    }

    internal fun pageRequest(): PageRequest {
        return PageRequest.of(0, 20)
    }
}
