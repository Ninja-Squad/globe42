package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.ninja_squad.dbsetup.Operations;
import com.ninja_squad.dbsetup.generator.ValueGenerators;
import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.SpentTimeStatistic;
import org.globe42.domain.TaskStatus;
import org.globe42.web.tasks.SpentTimeStatisticsCriteriaDTO;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests for {@link SpentTimeDao}
 * @author JB Nizet
 */
public class SpentTimeDaoTest extends BaseDaoTest {

    @Autowired
    private SpentTimeDao dao;

    @Before
    public void prepare() {
        Operation users = Insert.into("guser")
                                .withDefaultValue("password", "hashedPassword")
                                .withDefaultValue("admin", true)
                                .withDefaultValue("deleted", false)
                                .columns("id", "login")
                                .values(1L, "jb")
                                .values(2L, "ced")
                                .build();
        Operation tasks = Insert.into("task")
                                .withGeneratedValue("description", ValueGenerators.stringSequence("desc_"))
                                .withGeneratedValue("title", ValueGenerators.stringSequence("title_"))
                                .withDefaultValue("total_spent_time_in_minutes", 0)
                                .withDefaultValue("status", TaskStatus.DONE)
                                .withDefaultValue("creator_id", 1L)
                                .columns("id", "category_id")
                                .values(1L, 6L)
                                .values(2L, 7L)
                                .build();

        Operation spentTimes = Insert.into("spent_time")
                                     .withGeneratedValue("id", ValueGenerators.sequence())
                                     .columns("task_id", "minutes", "creator_id", "creation_instant")
                                     .values(1L, 10, 1L, Instant.parse("2017-12-02T00:00:00Z"))
                                     .values(1L, 20, 1L, Instant.parse("2017-12-03T00:00:00Z"))
                                     .values(1L, 30, 2L, Instant.parse("2017-12-04T00:00:00Z"))
                                     .values(1L, 40, 2L, Instant.parse("2017-12-05T00:00:00Z"))
                                     .values(2L, 50, 1L, Instant.parse("2017-12-02T00:00:00Z"))
                                     .values(2L, 60, 1L, Instant.parse("2017-12-03T00:00:00Z"))
                                     .values(2L, 70, 2L, Instant.parse("2017-12-04T00:00:00Z"))
                                     .values(2L, 80, 2L, Instant.parse("2017-12-05T00:00:00Z"))
                                     .build();

        dbSetup(Operations.sequenceOf(users, tasks, spentTimes));
    }

    @Test
    public void shouldFindSpentTimeStatisticsWithoutCriteria() {
        SpentTimeStatisticsCriteriaDTO criteria = new SpentTimeStatisticsCriteriaDTO(null, null);
        List<SpentTimeStatistic> result = dao.findSpentTimeStatistics(criteria);
        assertThat(result).hasSize(4);
        assertThat(result).extracting(s -> s.getCategory().getId(), s -> s.getUser().getId(), s -> s.getMinutes())
                          .containsOnly(tuple(6L, 1L, 30),
                                        tuple(6L, 2L, 70),
                                        tuple(7L, 1L, 110),
                                        tuple(7L, 2L, 150));
    }

    @Test
    public void shouldFindSpentTimeStatisticsWithStartDate() {
        SpentTimeStatisticsCriteriaDTO criteria = new SpentTimeStatisticsCriteriaDTO(LocalDate.of(2017, 12, 3), null);
        List<SpentTimeStatistic> result = dao.findSpentTimeStatistics(criteria);
        assertThat(result).hasSize(4);
        assertThat(result).extracting(s -> s.getCategory().getId(), s -> s.getUser().getId(), s -> s.getMinutes())
                          .containsOnly(tuple(6L, 1L, 20),
                                        tuple(6L, 2L, 70),
                                        tuple(7L, 1L, 60),
                                        tuple(7L, 2L, 150));
    }

    @Test
    public void shouldFindSpentTimeStatisticsWithEndDate() {
        SpentTimeStatisticsCriteriaDTO criteria = new SpentTimeStatisticsCriteriaDTO(null, LocalDate.of(2017, 12, 4));
        List<SpentTimeStatistic> result = dao.findSpentTimeStatistics(criteria);
        assertThat(result).hasSize(4);
        assertThat(result).extracting(s -> s.getCategory().getId(), s -> s.getUser().getId(), s -> s.getMinutes())
                          .containsOnly(tuple(6L, 1L, 30),
                                        tuple(6L, 2L, 30),
                                        tuple(7L, 1L, 110),
                                        tuple(7L, 2L, 70));
    }

    @Test
    public void shouldFindSpentTimeStatisticsWithStartAndEndDate() {
        SpentTimeStatisticsCriteriaDTO criteria = new SpentTimeStatisticsCriteriaDTO(LocalDate.of(2017, 12, 3),
                                                                                     LocalDate.of(2017, 12, 4));
        List<SpentTimeStatistic> result = dao.findSpentTimeStatistics(criteria);
        assertThat(result).hasSize(4);
        assertThat(result).extracting(s -> s.getCategory().getId(), s -> s.getUser().getId(), s -> s.getMinutes())
                          .containsOnly(tuple(6L, 1L, 20),
                                        tuple(6L, 2L, 30),
                                        tuple(7L, 1L, 60),
                                        tuple(7L, 2L, 70));
    }
}