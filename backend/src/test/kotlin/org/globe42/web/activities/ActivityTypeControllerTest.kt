package org.globe42.web.activities

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.globe42.domain.Gender
import org.globe42.domain.Person
import org.globe42.test.BaseTest
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import java.util.*

/**
 * Unit tests for [ActivityTypeController]
 * @author JB Nizet
 */
class ActivityTypeControllerTest : BaseTest() {
    @Mock
    private lateinit var mockPersonDao: PersonDao

    @InjectMocks
    private lateinit var controller: ActivityTypeController

    @Test
    fun shouldListParticipants() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findParticipants(ActivityType.MEAL)).thenReturn(Arrays.asList(person))

        val result = controller.list(ActivityType.MEAL)
        assertThat(result).extracting<Long> { (identity) -> identity.id }.containsExactly(42L)
    }
}
