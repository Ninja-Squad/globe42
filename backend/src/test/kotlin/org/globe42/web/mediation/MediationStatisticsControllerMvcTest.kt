package org.globe42.web.mediation

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.NoteDao
import org.globe42.domain.Country
import org.globe42.domain.Income
import org.globe42.domain.Note
import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.domain.Person
import org.globe42.domain.User
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.hamcrest.CoreMatchers
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import java.math.BigDecimal
import java.time.LocalDate

/**
 * MVC tests for [MediationStatisticsController]
 * @author JB Nizet
 */
@GlobeMvcTest(MediationStatisticsController::class)
class MediationStatisticsControllerMvcTest(@Autowired val mockMvc: MockMvc) {

    @MockkBean
    private lateinit var mockNoteDao: NoteDao

    @BeforeEach
    fun prepare() {
        val jb = Person().apply {
            id = 1L
            firstName = "JB"
            lastName = "Nizet"
            birthDate = LocalDate.of(1955, 7, 1) // 66 years minus one day
            nationality = Country().apply {
                id = "BEL"
                name = "Belgique"
            }
            addIncome(Income().apply { monthlyAmount = 1000.toBigDecimal() })
            addIncome(Income().apply { monthlyAmount = 500.toBigDecimal() })
        }

        val cedric = Person().apply {
            id = 2L
            firstName = "Cedric"
            lastName = "Exbrayat"
            birthDate = LocalDate.of(1985, 7, 3)  // 36 years plus one day
            nationality = Country().apply {
                id = "FRA"
                name = "France"
            }
            addIncome(Income().apply { monthlyAmount = 800.toBigDecimal() })
        }

        val noBirthDateNoIncomePerson = Person().apply {
            id = 3L
            firstName = "Agnes"
            lastName = "Crepet"
        }

        val malika = User().apply {
            id = 1L
            login = "malika"
        }
        val saadia = User().apply {
            id = 2L
            login = "saadia"
        }

        val jbNote1 = Note().apply {
            creator = malika
            creationInstant = LocalDate.of(2021, 2, 1).toInstant()
        }
        val jbNote2 = Note().apply {
            creator = saadia
            creationInstant = LocalDate.of(2021, 3, 1).toInstant()
        }
        val cedricNote1 = Note().apply {
            creator = saadia
            creationInstant = LocalDate.of(2021, 3, 1).toInstant()
        }
        val noBirthDateNoIncomePersonNote1 = Note().apply {
            creator = saadia
            creationInstant = LocalDate.of(2021, 4, 1).toInstant()
        }

        val fromInclusive = LocalDate.of(2021, 1, 1).toInstant()
        val toExclusive = LocalDate.of(2022, 1, 1).toInstant()

        every { mockNoteDao.findBetweenWithPerson(fromInclusive, toExclusive) } returns listOf(
            jbNote1 to jb,
            jbNote2 to jb,
            cedricNote1 to cedric,
            noBirthDateNoIncomePersonNote1 to noBirthDateNoIncomePerson
        )
    }

    @Test
    fun `should generate report`() {
        mockMvc.get("/api/mediation-statistics") {
            param("from", "2021-01-01")
            param("to", "2021-12-31")
        }.andExpect {
            status { isOk() }
            jsonValue("$.appointmentCount", 4)
            jsonValue("$.userAppointments[0].user.login", "malika")
            jsonValue("$.userAppointments[0].count", 1)
            jsonValue("$.userAppointments[1].user.login", "saadia")
            jsonValue("$.userAppointments[1].count", 3)
            jsonValue("$.personAppointments[0].person.firstName", "Agnes")
            jsonValue("$.personAppointments[0].count", 1)
            jsonValue("$.personAppointments[1].person.firstName", "Cedric")
            jsonValue("$.personAppointments[1].count", 1)
            jsonValue("$.personAppointments[2].person.firstName", "JB")
            jsonValue("$.personAppointments[2].count", 2)
            jsonValue("$.averageAge", 51.0)
            jsonValue("$.ageRangeAppointments[0].range.fromInclusive", null)
            jsonValue("$.ageRangeAppointments[0].range.toExclusive", 60)
            jsonValue("$.ageRangeAppointments[0].count", 1)
            jsonValue("$.ageRangeAppointments[1].range.fromInclusive", 60)
            jsonValue("$.ageRangeAppointments[1].range.toExclusive", 80)
            jsonValue("$.ageRangeAppointments[1].count", 2)
            jsonValue("$.ageRangeAppointments[2].range.fromInclusive", 80)
            jsonValue("$.ageRangeAppointments[2].range.toExclusive", null)
            jsonValue("$.ageRangeAppointments[2].count", 0)
            jsonValue("$.nationalityAppointments[0].nationality.name", "Belgique")
            jsonValue("$.nationalityAppointments[0].count", 2)
            jsonValue("$.nationalityAppointments[1].nationality.name", "France")
            jsonValue("$.nationalityAppointments[1].count", 1)
            jsonValue("$.averageIncomeMonthlyAmount", 1150)
        }
    }

    @Test
    fun `should generate report when no value to average`() {
        every { mockNoteDao.findBetweenWithPerson(any(), any()) } returns emptyList()

        mockMvc.get("/api/mediation-statistics") {
            param("from", "2021-01-01")
            param("to", "2021-12-31")
        }.andExpect {
            status { isOk() }
            jsonValue("$.appointmentCount", 0)
            jsonValue("$.averageAge", null)
            jsonValue("$.averageIncomeMonthlyAmount", null)
        }
    }

    private fun LocalDate.toInstant() = this.atStartOfDay().atZone(PARIS_TIME_ZONE).toInstant()
}
