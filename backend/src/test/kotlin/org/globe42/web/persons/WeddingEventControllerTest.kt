package org.globe42.web.persons

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.Gender
import org.globe42.domain.Person
import org.globe42.domain.WeddingEvent
import org.globe42.domain.WeddingEventType
import org.globe42.test.BaseTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import java.time.LocalDate
import java.util.*

/**
 * Unit tests for [WeddingEventController]
 * @author JB Nizet
 */
class WeddingEventControllerTest : BaseTest() {
    @Mock
    private lateinit var mockPersonDao: PersonDao

    @InjectMocks
    private lateinit var controller: WeddingEventController

    private lateinit var person: Person
    private lateinit var firstWedding: WeddingEvent
    private lateinit var firstDivorce: WeddingEvent

    @BeforeEach
    fun prepare() {
        person = Person(42L, "John", "Doe", Gender.MALE)
        firstWedding = WeddingEvent(34L)
        firstWedding.date = LocalDate.of(2000, 2, 28)
        firstWedding.type = WeddingEventType.WEDDING

        firstDivorce = WeddingEvent(35L)
        firstDivorce.date = LocalDate.of(2002, 3, 28)
        firstDivorce.type = WeddingEventType.DIVORCE

        person.addWeddingEvent(firstWedding)
        person.addWeddingEvent(firstDivorce)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun `should list`() {
        val result = controller.list(person.id!!)

        assertThat(result).extracting<Long>(WeddingEventDTO::id).containsExactly(
                firstWedding.id,
                firstDivorce.id)
        assertThat(result).extracting<LocalDate>(WeddingEventDTO::date).containsExactly(
                firstWedding.date,
                firstDivorce.date)
        assertThat(result).extracting<WeddingEventType>(WeddingEventDTO::type).containsExactly(
                firstWedding.type,
                firstDivorce.type)
    }

    @Test
    fun `should create`() {
        val date = LocalDate.of(2018, 3, 1)
        val command = WeddingEventCommandDTO(date, WeddingEventType.WEDDING)
        whenever(mockPersonDao.flush()).then {
            person.getWeddingEvents().find { it.date == date }?.let { it.id = 876 }
            Unit
        }

        val result = controller.create(person.id!!, command)

        assertThat(result.date).isEqualTo(command.date)
        assertThat(result.type).isEqualTo(command.type)
        assertThat(person.getWeddingEvents()).hasSize(3)
    }

    @Test
    fun `should delete`() {
        controller.delete(person.id!!, firstDivorce.id!!)

        assertThat(person.getWeddingEvents()).hasSize(1)
    }
}