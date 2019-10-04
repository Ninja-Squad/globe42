package org.globe42.dao

import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

/**
 * Tests for [MembershipDao]
 * @author JB Nizet
 */
class MembershipDaoTest : BaseDaoTest() {
    @Autowired
    private lateinit var dao: MembershipDao

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
                columns("id", "first_name", "last_name", "mediation_enabled", "gender", "deleted")
                values(1L, "Cédric", "Exbrayat", false, Gender.MALE, false)
            }

            insertInto("membership") {
                columns("id", "year", "person_id", "payment_mode", "payment_date", "card_number")
                values(1L, 2017, 1L, "UNKNOWN", "2017-01-31", "001")
                values(2L, 2018, 1L, "CHECK", "2018-01-31", "002")
            }
        }
    }

    @Test
    fun `should find by person`() {
        var result = dao.findByPerson(Person(1L))
        assertThat(result).hasSize(2).extracting<Long>(Membership::id).containsExactly(2L, 1L)

        result = dao.findByPerson(Person(2345L))
        assertThat(result).isEmpty()
    }

    @Test
    fun `should find by person and year`() {
        var result = dao.findByPersonAndYear(Person(1L), 2018)
        assertThat(result).isNotEmpty
        assertThat(result.get().id).isEqualTo(2L)

        result = dao.findByPersonAndYear(Person(1L), 2016)
        assertThat(result).isEmpty

        result = dao.findByPersonAndYear(Person(3456L), 2018)
        assertThat(result).isEmpty
    }
}
