package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Gender
import org.globe42.domain.Membership
import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.domain.PaymentMode
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import java.io.OutputStream
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

    @MockkBean
    lateinit var mockMembershipFormGenerator: MembershipFormGenerator

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
            cardNumber = 2
        )
    }

    @Test
    fun `should list`() {
        every { mockMembershipDao.findByPerson(person) } returns listOf(membership)

        mvc.get("/api/persons/{personId}/memberships", person.id!!).andExpect {
            status { isOk() }
            jsonPath("$") { isArray() }
            jsonValue("$[0].id", membership.id!!)
        }
    }

    @Test
    fun `should get current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        every { mockMembershipDao.findByPersonAndYear(person, currentYear) } returns membership

        mvc.get("/api/persons/{personId}/memberships/current", person.id!!).andExpect {
            status { isOk() }
            jsonValue("$.id", membership.id!!)
        }
    }

    @Test
    fun `should get membership form`() {
        every { mockMembershipFormGenerator.generate(person, any()) } answers {
            arg<OutputStream>(1).write("fake pdf body".toByteArray())
        }

        mvc.get("/api/persons/{personId}/memberships/form", person.id!!)
            .asyncDispatch()
            .andExpect {
                status { isOk() }
                content {
                    contentType(MediaType.APPLICATION_PDF)
                    string("fake pdf body")
                }
            }
    }

    @Test
    fun `should return empty content when getting current membership of person that doesn't have a current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        every { mockMembershipDao.findByPersonAndYear(person, currentYear) } returns null
        mvc.get("/api/persons/{personId}/memberships/current", person.id!!).andExpect {
            status { isNoContent() }
            content { string("") }
        }
    }

    @Test
    fun `should create membership`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CASH,
            LocalDate.of(2018, 1, 31),
            null
        )
        every { mockMembershipDao.findByPersonAndYear(person, command.year) } returns null
        every { mockMembershipDao.nextAvailableCardNumber(command.year) } returns 56
        every { mockMembershipDao.save(any<Membership>()) } answers {
            arg<Membership>(0).apply { id = 42L }
        }

        mvc.post("/api/persons/{personId}/memberships", person.id!!) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated() }
            jsonValue("$.id", 42L)
            jsonValue("$.cardNumber", 56)
        }
    }

    @Test
    fun `should update membership`() {
        every { mockMembershipDao.findByIdOrNull(membership.id!!) } returns membership
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 15),
            34
        )
        mvc.put("/api/persons/{personId}/memberships/{membershipId}", person.id!!, membership.id!!) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent() }
        }
    }

    @Test
    fun `should delete membership`() {
        every { mockMembershipDao.findByIdOrNull(membership.id!!) } returns membership

        mvc.delete("/api/persons/{personId}/memberships/{membershipId}", person.id!!, membership.id!!).andExpect {
            status { isNoContent() }
        }
    }
}
