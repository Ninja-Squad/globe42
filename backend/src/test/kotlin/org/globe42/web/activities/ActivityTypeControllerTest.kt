package org.globe42.web.activities

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Person
import org.junit.jupiter.api.Test

/**
 * Unit tests for [ActivityTypeController]
 * @author JB Nizet
 */
class ActivityTypeControllerTest {
    private val mockPersonDao = mockk<PersonDao>()

    private val controller = ActivityTypeController(mockPersonDao)

    @Test
    fun `should list participants`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        every { mockPersonDao.findParticipants(ActivityType.MEAL) } returns listOf(person)

        val result = controller.list(ActivityType.MEAL)
        assertThat(result).extracting<Long> { it.id }.containsExactly(42L)
    }
}
