package org.globe42.dao

import com.ninja_squad.dbsetup.generator.ValueGenerators
import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.SpentTimeStatistic
import org.globe42.domain.TaskStatus
import org.globe42.web.tasks.SpentTimeStatisticsCriteriaDTO
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.Instant
import java.time.LocalDate

/**
 * Tests for [SpentTimeDao]
 * @author JB Nizet
 */
class SpentTimeDaoTest : BaseDaoTest() {

    @Autowired
    private lateinit var dao: SpentTimeDao

    @BeforeEach
    fun prepare() {
        setup {
            insertInto("guser") {
                withDefaultValue("password", "hashedPassword")
                withDefaultValue("admin", true)
                withDefaultValue("deleted", false)
                columns("id", "login")
                values(1L, "jb")
                values(2L, "ced")
            }

            insertInto("task") {
                withGeneratedValue("description", ValueGenerators.stringSequence("desc_"))
                withGeneratedValue("title", ValueGenerators.stringSequence("title_"))
                withDefaultValue("total_spent_time_in_minutes", 0)
                withDefaultValue("status", TaskStatus.DONE)
                withDefaultValue("creator_id", 1L)
                columns("id", "category_id")
                values(1L, 6L)
                values(2L, 7L)
            }

            insertInto("spent_time") {
                withGeneratedValue("id", ValueGenerators.sequence())
                columns("task_id", "minutes", "creator_id", "creation_instant")
                values(1L, 10, 1L, Instant.parse("2017-12-02T00:00:00Z"))
                values(1L, 20, 1L, Instant.parse("2017-12-03T00:00:00Z"))
                values(1L, 30, 2L, Instant.parse("2017-12-04T00:00:00Z"))
                values(1L, 40, 2L, Instant.parse("2017-12-05T00:00:00Z"))
                values(2L, 50, 1L, Instant.parse("2017-12-02T00:00:00Z"))
                values(2L, 60, 1L, Instant.parse("2017-12-03T00:00:00Z"))
                values(2L, 70, 2L, Instant.parse("2017-12-04T00:00:00Z"))
                values(2L, 80, 2L, Instant.parse("2017-12-05T00:00:00Z"))
            }
        }
    }

    @Test
    fun `should find spent time statistics without criteria`() {
        val criteria = SpentTimeStatisticsCriteriaDTO(null, null)
        val result = dao.findSpentTimeStatistics(criteria)
        assertThat(result).hasSize(4)
        assertThat(result.map(SpentTimeStatistic::toStatResult))
                .containsOnly(StatResult(6L, 1L, 30),
                              StatResult(6L, 2L, 70),
                              StatResult(7L, 1L, 110),
                              StatResult(7L, 2L, 150))
    }

    @Test
    fun `should find spent time statistics with start date`() {
        val criteria = SpentTimeStatisticsCriteriaDTO(LocalDate.of(2017, 12, 3), null)
        val result = dao.findSpentTimeStatistics(criteria)
        assertThat(result).hasSize(4)
        assertThat(result.map(SpentTimeStatistic::toStatResult))
                .containsOnly(StatResult(6L, 1L, 20),
                              StatResult(6L, 2L, 70),
                              StatResult(7L, 1L, 60),
                              StatResult(7L, 2L, 150))
    }

    @Test
    fun `should find spent time statistics with end date`() {
        val criteria = SpentTimeStatisticsCriteriaDTO(null, LocalDate.of(2017, 12, 4))
        val result = dao.findSpentTimeStatistics(criteria)
        assertThat(result).hasSize(4)
        assertThat(result.map(SpentTimeStatistic::toStatResult))
                .containsOnly(StatResult(6L, 1L, 30),
                              StatResult(6L, 2L, 30),
                              StatResult(7L, 1L, 110),
                              StatResult(7L, 2L, 70))
    }

    @Test
    fun `should find spent time statistics with start and end date`() {
        val criteria = SpentTimeStatisticsCriteriaDTO(LocalDate.of(2017, 12, 3),
                                                      LocalDate.of(2017, 12, 4))
        val result = dao.findSpentTimeStatistics(criteria)
        assertThat(result).hasSize(4)
        assertThat(result.map(SpentTimeStatistic::toStatResult))
                .containsOnly(StatResult(6L, 1L, 20),
                              StatResult(6L, 2L, 30),
                              StatResult(7L, 1L, 60),
                              StatResult(7L, 2L, 70))
    }
}

private data class StatResult(val categoryId: Long, val userId: Long, val minutes: Int);
private fun SpentTimeStatistic.toStatResult() = StatResult(this.category.id!!, this.user.id!!, this.minutes)