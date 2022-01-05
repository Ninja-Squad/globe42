package org.globe42.dao

import com.ninja_squad.dbsetup.generator.ValueGenerators
import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.ActivityType
import org.globe42.domain.EntryType
import org.globe42.domain.FiscalStatus
import org.globe42.domain.Gender
import org.globe42.domain.HealthCareCoverage
import org.globe42.domain.HealthInsurance
import org.globe42.domain.Housing
import org.globe42.domain.MaritalStatus
import org.globe42.domain.PassportStatus
import org.globe42.domain.PaymentMode
import org.globe42.domain.Person
import org.globe42.domain.ResidencePermit
import org.globe42.domain.SchoolLevel
import org.globe42.domain.Visa
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.Instant

/**
 * Tests for [PersonDao]
 * @author JB Nizet
 */
class PersonDaoTest : BaseDaoTest() {
    @Autowired
    private lateinit var personDao: PersonDao

    @BeforeEach
    fun prepare() {
        setup {
            insertInto("person") {
                withDefaultValue("fiscal_status_up_to_date", false)
                withDefaultValue("fiscal_status", FiscalStatus.UNKNOWN)
                withDefaultValue("marital_status", MaritalStatus.UNKNOWN)
                withDefaultValue("housing", Housing.UNKNOWN)
                withDefaultValue("health_care_coverage", HealthCareCoverage.UNKNOWN)
                withDefaultValue("health_insurance", HealthInsurance.UNKNOWN)
                withDefaultValue("visa", Visa.UNKNOWN)
                withDefaultValue("residence_permit", ResidencePermit.UNKNOWN)
                withDefaultValue("entry_type", EntryType.UNKNOWN)
                withDefaultValue("passport_status", PassportStatus.UNKNOWN)
                withDefaultValue("school_level", SchoolLevel.UNKNOWN)
                columns("id", "first_name", "last_name", "mediation_enabled", "gender", "deleted")
                values(1L, "Cédric", "Exbrayat", false, Gender.MALE, false)
                values(2L, "Old", "Oldie", false, Gender.MALE, true)
                values(3L, "JB", "Nizet", true, Gender.MALE, false)
            }

            insertInto("participation") {
                columns("id", "activity_type", "person_id")
                values(1L, ActivityType.MEAL, 1L)
                values(2L, ActivityType.MEAL, 2L)
            }

            insertInto("membership") {
                withDefaultValue("payment_date", Instant.parse("2020-05-01T00:00:00Z"))
                withDefaultValue("payment_mode", PaymentMode.CASH)
                withGeneratedValue("card_number", ValueGenerators.sequence())
                withGeneratedValue("id", ValueGenerators.sequence())
                columns("year", "person_id")
                values(2019, 1L)
                values(2019, 2L)
                values(2019, 3L)
                values(2020, 1L)
                values(2020, 2L)
            }
        }
    }

    @Test
    fun `should insert`() {
        val person = Person()
        person.gender = Gender.MALE
        person.firstName = "JB"
        person.lastName = "Nizet"
        person.socialSecurityNumber = "5654389076543124"
        person.cafNumber = "765344"
        person.hostName = "Brigitte"

        personDao.save(person)
        personDao.flush()
    }

    @Test
    fun `should find by id`() {
        skipNextLaunch()
        assertThat(personDao.findByIdOrNull(1L)?.id).isEqualTo(1L)
    }

    @Test
    fun `should find participants`() {
        skipNextLaunch()
        assertThat(personDao.findParticipants(ActivityType.MEAL)).extracting<Long>(Person::id).containsOnly(1L)
        assertThat(personDao.findParticipants(ActivityType.SOCIAL_MEDIATION)).isEmpty()
    }

    @Test
    fun `should get next mediaton code`() {
        var result = personDao.nextMediationCode('R')
        assertThat(result).isEqualTo(1)
        result = personDao.nextMediationCode('r')
        assertThat(result).isEqualTo(2)
        result = personDao.nextMediationCode('a')
        assertThat(result).isEqualTo(1)
    }

    @Test
    fun `should find not deleted`() {
        assertThat(personDao.findNotDeleted()).extracting<Long>(Person::id).containsOnly(1L, 3L)
    }

    @Test
    fun `should find deleted`() {
        assertThat(personDao.findDeleted()).extracting<Long>(Person::id).containsOnly(2L)
    }

    @Test
    fun `should find not deleted with mediation`() {
        assertThat(personDao.findNotDeletedWithMediation()).extracting<Long>(Person::id).containsOnly(3L)
    }

    @Test
    fun `should find health care coverage`() {
        assertThat(personDao.findHealthCareCoverage())
            .containsOnly(HealthCareCoverageEntry(HealthCareCoverage.UNKNOWN, 1L))
    }

    @Test
    fun `should find persons without membership for year`() {
        assertThat(personDao.findMissingMembershipsForYear(2019)).isEmpty()
        assertThat(personDao.findMissingMembershipsForYear(2020).map(Person::id)).containsOnly(3L)
        assertThat(personDao.findMissingMembershipsForYear(2021).map(Person::id)).containsExactly(1L, 3L)
    }
}
