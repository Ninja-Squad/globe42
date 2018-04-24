package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Participation
import org.globe42.domain.Person
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
import java.util.*

/**
 * MVC tests for [ParticipationController]
 * @author JB Nizet
 */
@GlobeMvcTest(ParticipationController::class)
class ParticipationControllerMvcTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

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
    fun shouldList() {
        mvc.perform(get("/api/persons/{personId}/participations", person.id))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$[0].id").value(34))
    }

    @Test
    fun shouldCreate() {
        val command = ParticipationCommandDTO(ActivityType.SOCIAL_MEDIATION)
        whenever(mockPersonDao.flush()).then {
            person.getParticipations().find { it.activityType == ActivityType.SOCIAL_MEDIATION }?.let { it.id = 345L }
            Unit
        }
        mvc.perform(post("/api/persons/{personId}/participations", person.id)
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.activityType").value(ActivityType.SOCIAL_MEDIATION.name))
    }

    @Test
    fun shouldDelete() {
        mvc.perform(delete("/api/persons/{personId}/participations/{participationId}",
                             person.id,
                             mealParticipation.id))
                .andExpect(status().isNoContent)
    }
}
