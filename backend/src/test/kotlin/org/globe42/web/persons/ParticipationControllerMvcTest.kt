package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Participation
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.util.*

/**
 * MVC tests for [ParticipationController]
 * @author JB Nizet
 */
@GlobeMvcTest(ParticipationController::class)
class ParticipationControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    private lateinit var person: Person
    private lateinit var mealParticipation: Participation

    @BeforeEach
    fun prepare() {
        person = Person(42L, "John", "Doe", Gender.MALE)
        mealParticipation = Participation(34L)
        mealParticipation.activityType = ActivityType.MEAL
        person.addParticipation(mealParticipation)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun `should list`() {
        mvc.get("/api/persons/{personId}/participations", person.id).andExpect {
            status { isOk }
            jsonValue("$[0].id", 34)
        }
    }

    @Test
    fun `should create`() {
        val command = ParticipationCommandDTO(ActivityType.SOCIAL_MEDIATION)
        whenever(mockPersonDao.flush()).then {
            person.getParticipations().find { it.activityType == ActivityType.SOCIAL_MEDIATION }?.let { it.id = 345L }
            Unit
        }
        mvc.post("/api/persons/{personId}/participations", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.activityType", ActivityType.SOCIAL_MEDIATION.name)
        }
    }

    @Test
    fun `should delete`() {
        mvc.delete("/api/persons/{personId}/participations/{participationId}", person.id, mealParticipation.id)
            .andExpect {
                status { isNoContent }
            }
    }
}
