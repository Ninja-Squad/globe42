package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Country
import org.globe42.domain.Gender
import org.globe42.domain.Participation
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.*
import java.time.LocalDate
import java.util.*

/**
 * MVC test for [PersonController]
 * @author JB Nizet
 */
@GlobeMvcTest(PersonController::class)
class PersonControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {

    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @MockBean
    private lateinit var mockCoupleDao: CoupleDao

    @MockBean
    private lateinit var mockCountryDao: CountryDao

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(1L, "John", "Doe", Gender.MALE)
        person.entryDate = LocalDate.of(2017, 5, 21)
        person.mediationCode = "A2"

        whenever(mockCountryDao.findById(any())).thenReturn(Optional.of(Country("FRA", "France")))
    }

    @Test
    fun `should list`() {
        whenever(mockPersonDao.findNotDeleted()).thenReturn(listOf<Person>(person))

        mvc.get("/api/persons").andExpect {
            status { isOk }
            jsonValue("$[0].id", 1)
        }
    }

    @Test
    fun `should list deleted`() {
        whenever(mockPersonDao.findDeleted()).thenReturn(listOf<Person>(person))

        mvc.get("/api/persons") {
            param("deleted", "")
        }.andExpect {
            status { isOk }
            jsonValue("$[0].id", 1)
        }
    }

    @Test
    fun `should get`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.get("/api/persons/{personId}", person.id).andExpect {
            status { isOk }
            jsonValue("$.id", 1)
            jsonValue("$.entryDate", "2017-05-21")
            jsonValue("$.entryDate", "2017-05-21")
        }
    }

    @Test
    fun `should 404 if person not found`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        mvc.get("/api/persons/{personId}", person.id).andExpect {
            status { isNotFound }
        }
    }

    @Test
    fun `should create`() {
        whenever(mockPersonDao.save(any<Person>())).thenReturnModifiedFirstArgument<Person> { it.id = 1L }

        mvc.post("/api/persons") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(PersonControllerTest.createCommand())
        }.andExpect {
            status { isCreated }
            jsonValue("$.id", 1)
        }
    }

    @Test
    fun `should update`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.put("/api/persons/{personId}", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(PersonControllerTest.createCommand())
        }.andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should delete`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.delete("/api/persons/{personId}", person.id).andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should resurrect`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.delete("/api/persons/{personId}/deletion", person.id).andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should signal death`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        person.addParticipation(Participation(65L))

        val command = PersonDeathCommandDTO(LocalDate.now())
        mvc.put("/api/persons/{personId}/death", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }

        assertThat(person.deathDate).isEqualTo(command.deathDate)
        assertThat(person.getParticipations()).isEmpty()
    }
}
