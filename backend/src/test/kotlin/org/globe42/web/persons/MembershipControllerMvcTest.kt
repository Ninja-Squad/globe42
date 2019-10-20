package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.*
import java.time.LocalDate

/**
 * MVC tests for [MembershipController]
 * @author JB Nizet
 */
@GlobeMvcTest(MembershipController::class)
class MembershipControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean(relaxUnitFun = true)
    lateinit var mockMembershipDao: MembershipDao

    @MockkBean
    lateinit var mockPersonDao: PersonDao

    lateinit var person: Person
    lateinit var membership: Membership

    @BeforeEach
    fun prepare() {
        person = Person(42L, "John", "Doe", Gender.MALE)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        membership = Membership(
            id = 2L,
            person = person,
            year = 2018,
            paymentDate = LocalDate.of(2018, 1, 31),
            paymentMode = PaymentMode.CASH,
            cardNumber = "002"
        )
    }

    @Test
    fun `should list`() {
        every { mockMembershipDao.findByPerson(person) } returns listOf(membership)

        mvc.get("/api/persons/{personId}/memberships", person.id!!).andExpect {
            status { isOk }
            jsonPath("$") { isArray }
            jsonValue("$[0].id", membership.id!!)
        }
    }

    @Test
    fun `should get current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        every { mockMembershipDao.findByPersonAndYear(person, currentYear) } returns membership

        mvc.get("/api/persons/{personId}/memberships/current", person.id!!).andExpect {
            status { isOk }
            jsonValue("$.id", membership.id!!)
        }
    }

    @Test
    fun `should return empty content when getting current membership of person that doesn't have a current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        every { mockMembershipDao.findByPersonAndYear(person, currentYear) } returns null
        mvc.get("/api/persons/{personId}/memberships/current", person.id!!).andExpect {
            status { isNoContent }
            content { string("") }
        }
    }

    @Test
    fun `should create membership`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CASH,
            LocalDate.of(2018, 1, 31),
            "002"
        )
        every { mockMembershipDao.findByPersonAndYear(person, command.year) } returns null
        every { mockMembershipDao.save(any<Membership>()) } answers {
            arg<Membership>(0).apply { id = 42L }
        }

        mvc.post("/api/persons/{personId}/memberships", person.id!!) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.id", 42L)
        }
    }

    @Test
    fun `should update membership`() {
        every { mockMembershipDao.findByIdOrNull(membership.id!!) } returns membership
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 15),
            "003"
        )
        mvc.put("/api/persons/{personId}/memberships/{membershipId}", person.id!!, membership.id!!) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should delete membership`() {
        every { mockMembershipDao.findByIdOrNull(membership.id!!) } returns membership

        mvc.delete("/api/persons/{personId}/memberships/{membershipId}", person.id!!, membership.id!!).andExpect {
            status { isNoContent }
        }
    }
}
