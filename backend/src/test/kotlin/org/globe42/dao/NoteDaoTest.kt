package org.globe42.dao

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.groups.Tuple.tuple
import org.globe42.domain.EntryType
import org.globe42.domain.FiscalStatus
import org.globe42.domain.HealthCareCoverage
import org.globe42.domain.HealthInsurance
import org.globe42.domain.Housing
import org.globe42.domain.MaritalStatus
import org.globe42.domain.PassportStatus
import org.globe42.domain.ResidencePermit
import org.globe42.domain.SchoolLevel
import org.globe42.domain.Visa
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.Instant

/**
 * Tests for [NoteDao]
 * @author JB Nizet
 */
internal class NoteDaoTest : BaseDaoTest() {
    @Autowired
    private lateinit var dao: NoteDao

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
                withDefaultValue("mediation_enabled", true)
                withDefaultValue("gender", "MALE")
                withDefaultValue("deleted", false)
                columns("id", "first_name", "last_name")
                values(1L, "Cédric", "Exbrayat")
                values(2L, "JB", "Nizet")
            }

            insertInto("guser") {
                withDefaultValue("task_assignment_email_notification_enabled", false)
                withDefaultValue("password", "password")
                withDefaultValue("admin", false)
                withDefaultValue("deleted", false)
                columns("id", "login")
                values(1L, "malika")
            }

            insertInto("note") {
                withDefaultValue("text", "bla bla")
                withDefaultValue("creator_id", 1L)
                withDefaultValue("creation_instant", Instant.parse("2021-01-12T00:00:00Z"))
                columns("id", "category")
                values(1L, "OTHER")
                values(2L, "APPOINTMENT")
                values(3L, "APPOINTMENT")
                values(4L, "APPOINTMENT")
            }

            insertInto("person_note") {
                columns("person_id", "note_id")
                values(1L, 1L)
                values(1L, 2L)
                values(2L, 3L)
                values(2L, 4L)
            }
        }
    }

    @Test
    fun `should list appointments between with persons`() {
        var appointmentsWithPerson = dao.findBetweenWithPerson(Instant.parse("2021-01-01T00:00:00Z"), Instant.parse("2021-01-11T00:00:00Z"))
        assertThat(appointmentsWithPerson).isEmpty()

        appointmentsWithPerson = dao.findBetweenWithPerson(Instant.parse("2021-01-01T00:00:00Z"), Instant.parse("2021-02-01T00:00:00Z"))
        assertThat(appointmentsWithPerson).extracting({ it.first.id}, {it.second.id}).containsOnly(
            tuple(2L, 1L),
            tuple(3L, 2L),
            tuple(4L, 2L),
        )
    }
}
