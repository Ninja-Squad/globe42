package org.globe42.web.activities

import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * MVC tests for [ActivityTypeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ActivityTypeController::class)
class ActivityTypeControllerMvcTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    @Throws(Exception::class)
    fun `should list participants`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        person.email = "john@doe.com"
        whenever(mockPersonDao.findParticipants(ActivityType.MEAL)).thenReturn(listOf(person))

        mvc.perform(get("/api/activity-types/{activityType}/participants", ActivityType.MEAL))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(42))
            .andExpect(jsonPath("$[0].email").value(person.email!!))
    }
}
