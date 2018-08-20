package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Country
import org.globe42.domain.Gender
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDate
import java.util.*

/**
 * MVC test for [PersonController]
 * @author JB Nizet
 */
@GlobeMvcTest(PersonController::class)
class PersonControllerMvcTest {

    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @MockBean
    private lateinit var mockCoupleDao: CoupleDao

    @MockBean
    private lateinit var mockCountryDao: CountryDao

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var mvc: MockMvc

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

        mvc.perform(get("/api/persons"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(1))
    }

    @Test
    fun `should list deleted`() {
        whenever(mockPersonDao.findDeleted()).thenReturn(listOf<Person>(person))

        mvc.perform(get("/api/persons").param("deleted", ""))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(1))
    }

    @Test
    fun `should get`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.perform(get("/api/persons/{personId}", person.id))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.entryDate").value("2017-05-21"))
            .andExpect(jsonPath("$.entryDate").value("2017-05-21"))
    }

    @Test
    fun `should 404 if person not found`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        mvc.perform(get("/api/persons/{personId}", person.id))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `should create`() {
        whenever(mockPersonDao.save(any<Person>())).thenReturnModifiedFirstArgument<Person> { it.id = 1L }

        mvc.perform(
            post("/api/persons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(PersonControllerTest.createCommand()))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(1))
    }

    @Test
    fun `should update`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.perform(
            put("/api/persons/{personId}", person.id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(PersonControllerTest.createCommand()))
        )
            .andExpect(status().isNoContent)
    }

    @Test
    fun `should delete`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.perform(delete("/api/persons/{personId}", person.id))
            .andExpect(status().isNoContent)
    }

    @Test
    fun `should resurrect`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        mvc.perform(delete("/api/persons/{personId}/deletion", person.id))
            .andExpect(status().isNoContent)
    }
}
