package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninja_squad.dbsetup.Operations;
import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.FiscalStatus;
import org.globe42.domain.Gender;
import org.globe42.domain.HealthCareCoverage;
import org.globe42.domain.Housing;
import org.globe42.domain.MaritalStatus;
import org.globe42.domain.TaskStatus;
import org.globe42.domain.User;
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
        Operation persons =
            Insert.into("person")
                  .withDefaultValue("fiscal_status_up_to_date", false)
                  .withDefaultValue("fiscal_status", FiscalStatus.UNKNOWN)
                  .withDefaultValue("marital_status", MaritalStatus.UNKNOWN)
                  .withDefaultValue("housing", Housing.UNKNOWN)
                  .withDefaultValue("health_care_coverage", HealthCareCoverage.UNKNOWN)
                  .columns("id", "first_name", "last_name", "gender", "adherent", "mediation_enabled")
                  .values(1L, "Cedric", "Exbrayat", Gender.MALE, true, false)
                  .build();

        Operation users = Insert.into("guser")
                                .columns("id", "login", "password", "admin")
                                .values(1L, "jb", "hashedPassword", true)
                                .build();
        Operation tasks = Insert.into("task")
                                .columns("id", "status", "title", "description")
                                .withDefaultValue("total_spent_time_in_minutes", 0)
                                .values(1L, TaskStatus.DONE, "task 1", "task desc 1")
                                .build();

        Operation spentTimes = Insert.into("spent_time")
                                     .columns("id", "minutes", "task_id", "creation_instant", "creator_id")
                                     .values(1L, 10, 1L, "2017-11-01", 1L)
                                     .build();

        dbSetup(Operations.sequenceOf(users, persons, tasks, spentTimes));
    }

    @Test
    public void shouldResetCreator() {
        dao.resetCreatorOnSpentTimesCreatedBy(new User(1L));
        assertThat(dao.findById(1L).get().getCreator()).isNull();
    }
}
