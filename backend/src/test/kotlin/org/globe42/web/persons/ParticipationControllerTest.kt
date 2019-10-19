package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Participation
import org.globe42.domain.Person
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.*

/**
 * Unit tests for [ParticipationController]
 * @author JB Nizet
 */
class ParticipationControllerTest {
    private val mockPersonDao = mockk<PersonDao>()

    private val controller = ParticipationController(mockPersonDao)

    private lateinit var person: Person
    private lateinit var mealParticipation: Participation

    @BeforeEach
    fun prepare() {
        mealParticipation = Participation(34L)
        mealParticipation.activityType = ActivityType.MEAL
        person = Person(42L, "John", "Doe", Gender.MALE)
        person.addParticipation(mealParticipation)
        every { mockPersonDao.findById(person.id!!) } returns Optional.of(person)
    }

    @Test
    fun `should list`() {
        val result = controller.list(person.id!!)

        assertThat(result).extracting<Long>(ParticipationDTO::id).containsExactly(mealParticipation.id)
        assertThat(result).extracting<ActivityType>(ParticipationDTO::activityType)
            .containsExactly(mealParticipation.activityType)
    }

    @Test
    fun `should create`() {
        val command = ParticipationCommandDTO(ActivityType.SOCIAL_MEDIATION)
        every { mockPersonDao.flush() } answers {
            person.getParticipations().find { it.activityType == ActivityType.SOCIAL_MEDIATION }?.let { it.id = 345L }
            Unit
        }
        val result = controller.create(person.id!!, command)

        assertThat(result.activityType).isEqualTo(command.activityType)
        assertThat(person.getParticipations()).extracting<ActivityType>(Participation::activityType)
            .containsOnly(ActivityType.MEAL, ActivityType.SOCIAL_MEDIATION)
    }

    @Test
    fun `should delete`() {
        controller.delete(person.id!!, mealParticipation.id!!)
        assertThat(person.getParticipations()).isEmpty()
    }
}
