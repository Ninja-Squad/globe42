package org.globe42.web.activities

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

/**
 * MVC tests for [ActivityTypeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ActivityTypeController::class)
class ActivityTypeControllerMvcTest(@Autowired private val mvc: MockMvc) {
    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    @Test
    fun `should list participants`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        person.email = "john@doe.com"
        every { mockPersonDao.findParticipants(ActivityType.MEAL) } returns listOf(person)

        mvc.get("/api/activity-types/{activityType}/participants", ActivityType.MEAL).andExpect {
            status { isOk }
            jsonValue("$[0].id", 42)
            jsonValue("$[0].email", person.email!!)
        }
    }
}
