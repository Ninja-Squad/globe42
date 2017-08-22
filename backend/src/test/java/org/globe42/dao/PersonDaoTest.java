package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.FiscalStatus;
import org.globe42.domain.Gender;
import org.globe42.domain.Housing;
import org.globe42.domain.MaritalStatus;
import org.globe42.domain.HealthCareCoverage;
import org.globe42.domain.Person;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests for {@link PersonDao}
 * @author JB Nizet
 */
public class PersonDaoTest extends BaseDaoTest {
    @Autowired
    private PersonDao personDao;

    @Before
    public void prepare() {
        Operation person =
            Insert.into("person")
                .withDefaultValue("fiscal_status_up_to_date", false)
                .withDefaultValue("fiscal_status", FiscalStatus.UNKNOWN)
                .withDefaultValue("marital_status", MaritalStatus.UNKNOWN)
                .withDefaultValue("housing", Housing.UNKNOWN)
                .withDefaultValue("health_care_coverage", HealthCareCoverage.UNKNOWN)
                .columns("id", "first_name", "last_name", "mediation_enabled", "gender", "adherent")
                .values(1L, "Cédric", "Exbrayat", false, Gender.MALE, false)
                .build();
        dbSetup(person);
    }

    @Test
    public void shouldInsert() {
        Person person = new Person();
        person.setGender(Gender.MALE);
        person.setFirstName("JB");
        person.setLastName("Nizet");

        personDao.save(person);
        personDao.flush();
    }

    @Test
    public void shouldFindById() {
        TRACKER.skipNextLaunch();
        assertThat(personDao.findById(1L)).hasValueSatisfying(p -> {
            assertThat(p.getId()).isEqualTo(1L);
        });
    }

    @Test
    public void shouldGetNextMediatonCode() {
        int result = personDao.nextMediationCode('R');
        assertThat(result).isEqualTo(1);
        result = personDao.nextMediationCode('r');
        assertThat(result).isEqualTo(2);
        result = personDao.nextMediationCode('a');
        assertThat(result).isEqualTo(1);
    }
}
