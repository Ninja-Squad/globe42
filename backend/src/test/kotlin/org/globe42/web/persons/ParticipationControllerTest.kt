package org.globe42.web.persons

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Participation
import org.globe42.domain.Person
import org.globe42.test.BaseTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import java.util.*

/**
 * Unit tests for [ParticipationController]
 * @author JB Nizet
 */
class ParticipationControllerTest : BaseTest() {
    @Mock
    private lateinit var mockPersonDao: PersonDao

    @InjectMocks
    private lateinit var controller: ParticipationController

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
        val result = controller.list(person.id!!)

        assertThat(result).extracting<Long>(ParticipationDTO::id).containsExactly(mealParticipation.id)
        assertThat(result).extracting<ActivityType>(ParticipationDTO::activityType)
            .containsExactly(mealParticipation.activityType)
    }

    @Test
    fun `should create`() {
        val command = ParticipationCommandDTO(ActivityType.SOCIAL_MEDIATION)
        whenever(mockPersonDao.flush()).then {
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
