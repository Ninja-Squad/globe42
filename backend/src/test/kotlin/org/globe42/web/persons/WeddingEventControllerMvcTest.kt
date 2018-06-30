package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.globe42.test.GlobeMvcTest
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
 * MVC tests for [WeddingEventController]
 * @author JB Nizet
 */
@GlobeMvcTest(WeddingEventController::class)
class WeddingEventControllerMvcTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private lateinit var person: Person
    private lateinit var firstWedding: WeddingEvent

    @BeforeEach
    fun prepare() {
        person = Person(42L, "John", "Doe", Gender.MALE)
        firstWedding = WeddingEvent(34L)
        firstWedding.date = LocalDate.of(2000, 2, 28)
        firstWedding.type = WeddingEventType.WEDDING
        firstWedding.location = Location.ABROAD
        person.addWeddingEvent(firstWedding)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    @Throws(Exception::class)
    fun `should list`() {
        mvc.perform(get("/api/persons/{personId}/wedding-events", person.id))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(34))
            .andExpect(jsonPath("$[0].date").value("2000-02-28"))
            .andExpect(jsonPath("$[0].type").value(WeddingEventType.WEDDING.name))
            .andExpect(jsonPath("$[0].location").value(Location.ABROAD.name))
    }

    @Test
    @Throws(Exception::class)
    fun `should create`() {
        val date = LocalDate.of(2002, 3, 28)
        val command = WeddingEventCommandDTO(
            date,
            WeddingEventType.DIVORCE,
            Location.FRANCE
        )
        whenever(mockPersonDao.flush()).then {
            person.getWeddingEvents().find { it.date == date }?.let { it.id = 876 }
            Unit
        }
        mvc.perform(
            post("/api/persons/{personId}/wedding-events", person.id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.type").value(WeddingEventType.DIVORCE.name))
    }

    @Test
    @Throws(Exception::class)
    fun `should delete`() {
        mvc.perform(delete("/api/persons/{personId}/wedding-events/{eventId}", person.id, firstWedding.id))
            .andExpect(status().isNoContent)
    }
}
