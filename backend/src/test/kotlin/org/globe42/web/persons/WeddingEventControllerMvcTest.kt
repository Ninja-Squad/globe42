package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.PersonDao
import org.globe42.domain.*
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
import java.time.LocalDate
import java.util.*

/**
 * MVC tests for [WeddingEventController]
 * @author JB Nizet
 */
@GlobeMvcTest(WeddingEventController::class)
class WeddingEventControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean
    private lateinit var mockPersonDao: PersonDao

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
        every { mockPersonDao.findById(person.id!!)} returns Optional.of(person)
    }

    @Test
    fun `should list`() {
        mvc.get("/api/persons/{personId}/wedding-events", person.id).andExpect {
            status { isOk }
            jsonValue("$[0].id", 34)
            jsonValue("$[0].date", "2000-02-28")
            jsonValue("$[0].type", WeddingEventType.WEDDING.name)
            jsonValue("$[0].location", Location.ABROAD.name)
        }
    }

    @Test
    fun `should create`() {
        val date = LocalDate.of(2002, 3, 28)
        val command = WeddingEventCommandDTO(
            date,
            WeddingEventType.DIVORCE,
            Location.FRANCE
        )
        every { mockPersonDao.flush() } answers {
            person.getWeddingEvents().find { it.date == date }?.let { it.id = 876 }
            Unit
        }
        mvc.post("/api/persons/{personId}/wedding-events", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.type", WeddingEventType.DIVORCE.name)
        }
    }

    @Test
    fun `should delete`() {
        mvc.delete("/api/persons/{personId}/wedding-events/{eventId}", person.id, firstWedding.id).andExpect {
            status { isNoContent }
        }
    }
}
