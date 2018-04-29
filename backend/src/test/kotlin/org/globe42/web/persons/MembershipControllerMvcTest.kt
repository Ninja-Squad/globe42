package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.time.LocalDate
import java.util.*

/**
 * MVC tests for [MembershipController]
 * @author JB Nizet
 */
@GlobeMvcTest(MembershipController::class)
class MembershipControllerMvcTest {
    @MockBean
    lateinit var mockMembershipDao: MembershipDao

    @MockBean
    lateinit var mockPersonDao: PersonDao

    @Autowired
    lateinit var mvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    lateinit var person: Person
    lateinit var membership: Membership

    @BeforeEach
    fun prepare() {
        person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        membership = Membership(
            2L,
            person,
            2018,
            LocalDate.of(2018, 1, 31),
            PaymentMode.CASH,
            "002"
        )
    }

    @Test
    fun `should list`() {
        whenever(mockMembershipDao.findByPerson(person)).thenReturn(listOf(membership))

        mvc.perform(get("/api/persons/{personId}/memberships", person.id!!))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].id").value(membership.id!!))
    }

    @Test
    fun `should get current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        whenever(mockMembershipDao.findByPersonAndYear(person, currentYear)).thenReturn(Optional.of(membership))

        mvc.perform(get("/api/persons/{personId}/memberships/current", person.id!!))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(membership.id!!))
    }

    @Test
    fun `should return empty content when getting current membership of person that doesn't have a current membership`() {
        mvc.perform(get("/api/persons/{personId}/memberships/current", person.id!!))
            .andExpect(status().isNoContent())
            .andExpect(content().string(""))
    }

    @Test
    fun `should create membership`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CASH,
            LocalDate.of(2018, 1, 31),
            "002"
        )
        whenever(mockMembershipDao.save(any<Membership>())).thenReturnModifiedFirstArgument<Membership> {
            it.id = 42L
        }

        mvc.perform(
            post("/api/persons/{personId}/memberships", person.id!!)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(42L))
    }

    @Test
    fun `should update membership`() {
        whenever(mockMembershipDao.findById(membership.id!!)).thenReturn(Optional.of(membership))
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 15),
            "003"
        )
        mvc.perform(
            put("/api/persons/{personId}/memberships/{membershipId}", person.id!!, membership.id!!)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isNoContent())
    }

    @Test
    fun `should delete membership`() {
        whenever(mockMembershipDao.findById(membership.id!!)).thenReturn(Optional.of(membership))

        mvc.perform(delete("/api/persons/{personId}/memberships/{membershipId}", person.id!!, membership.id!!))
            .andExpect(status().isNoContent())
    }
}
