package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Country
import org.globe42.domain.Gender
import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.domain.Participation
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.*
import java.time.LocalDate

/**
 * MVC test for [PersonController]
 * @author JB Nizet
 */
@GlobeMvcTest(PersonController::class)
@MockkBean(CoupleDao::class)
class PersonControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {

    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    @MockkBean
    private lateinit var mockCountryDao: CountryDao

    @MockkBean
    private lateinit var mockMembershipDao: MembershipDao

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(1L, "John", "Doe", Gender.MALE).apply {
            entryDate = LocalDate.of(2017, 5, 21)
            mediationCode = "A2"
        }

        every { mockCountryDao.findByIdOrNull(any()) } returns Country("FRA", "France")
    }

    @Test
    fun `should list`() {
        every { mockPersonDao.findNotDeleted() } returns listOf(person)

        mvc.get("/api/persons").andExpect {
            status { isOk() }
            jsonValue("$[0].id", 1)
        }
    }

    @Test
    fun `should list deleted`() {
        every { mockPersonDao.findDeleted() } returns listOf(person)

        mvc.get("/api/persons") {
            param("deleted", "")
        }.andExpect {
            status { isOk() }
            jsonValue("$[0].id", 1)
        }
    }

    @Test
    fun `should get`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        mvc.get("/api/persons/{personId}", person.id).andExpect {
            status { isOk() }
            jsonValue("$.id", 1)
            jsonValue("$.entryDate", "2017-05-21")
            jsonValue("$.entryDate", "2017-05-21")
        }
    }

    @Test
    fun `should 404 if person not found`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null

        mvc.get("/api/persons/{personId}", person.id).andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `should create`() {
        every { mockPersonDao.nextMediationCode(any()) } returns 1
        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 1L } }

        mvc.post("/api/persons") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(PersonControllerTest.createCommand())
        }.andExpect {
            status { isCreated() }
            jsonValue("$.id", 1)
        }
    }

    @Test
    fun `should update`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.nextMediationCode(any()) } returns 1
        mvc.put("/api/persons/{personId}", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(PersonControllerTest.createCommand())
        }.andExpect {
            status { isNoContent() }
        }
    }

    @Test
    fun `should delete`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        mvc.delete("/api/persons/{personId}", person.id).andExpect {
            status { isNoContent() }
        }
    }

    @Test
    fun `should resurrect`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        mvc.delete("/api/persons/{personId}/deletion", person.id).andExpect {
            status { isNoContent() }
        }
    }

    @Test
    fun `should signal death`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        person.addParticipation(Participation(65L))

        val command = PersonDeathCommandDTO(LocalDate.now())
        mvc.put("/api/persons/{personId}/death", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent() }
        }

        assertThat(person.deathDate).isEqualTo(command.deathDate)
        assertThat(person.getParticipations()).isEmpty()
    }

    @Test
    fun `should get reminders`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockMembershipDao.findByPersonAndYear(person, LocalDate.now(PARIS_TIME_ZONE).year) } returns null

        mvc.get("/api/persons/{personId}/reminders", person.id)
            .andExpect {
                status { isOk() }
                jsonValue("$[0].type", ReminderType.MEMBERSHIP_TO_RENEW.name)
            }
    }
}
