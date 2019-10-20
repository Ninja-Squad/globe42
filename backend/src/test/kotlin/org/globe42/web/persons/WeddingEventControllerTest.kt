package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.data.repository.findByIdOrNull
import java.time.LocalDate

/**
 * Unit tests for [WeddingEventController]
 * @author JB Nizet
 */
class WeddingEventControllerTest {
    private val mockPersonDao = mockk<PersonDao>()

    private val controller = WeddingEventController(mockPersonDao)

    private lateinit var person: Person
    private lateinit var firstWedding: WeddingEvent
    private lateinit var firstDivorce: WeddingEvent

    @BeforeEach
    fun prepare() {
        firstWedding = WeddingEvent(34L).apply {
            date = LocalDate.of(2000, 2, 28)
            type = WeddingEventType.WEDDING
            location = Location.ABROAD
        }

        firstDivorce = WeddingEvent(35L).apply {
            date = LocalDate.of(2002, 3, 28)
            type = WeddingEventType.DIVORCE
            location = Location.FRANCE
        }

        person = Person(42L, "John", "Doe", Gender.MALE).apply {
            addWeddingEvent(firstWedding)
            addWeddingEvent(firstDivorce)
        }

        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
    }

    @Test
    fun `should list`() {
        val result = controller.list(person.id!!)

        assertThat(result).extracting<Long>(WeddingEventDTO::id).containsExactly(
            firstWedding.id,
            firstDivorce.id
        )
        assertThat(result).extracting<LocalDate>(WeddingEventDTO::date).containsExactly(
            firstWedding.date,
            firstDivorce.date
        )
        assertThat(result).extracting<WeddingEventType>(WeddingEventDTO::type).containsExactly(
            firstWedding.type,
            firstDivorce.type
        )
        assertThat(result).extracting<Location>(WeddingEventDTO::location).containsExactly(
            firstWedding.location,
            firstDivorce.location
        )
    }

    @Test
    fun `should create`() {
        val date = LocalDate.of(2018, 3, 1)
        val command = WeddingEventCommandDTO(date, WeddingEventType.WEDDING, Location.FRANCE)
        every { mockPersonDao.flush() } answers {
            person.getWeddingEvents().find { it.date == date }?.let { it.id = 876 }
            Unit
        }

        val result = controller.create(person.id!!, command)

        assertThat(result.date).isEqualTo(command.date)
        assertThat(result.type).isEqualTo(command.type)
        assertThat(result.location).isEqualTo(command.location)
        assertThat(person.getWeddingEvents()).hasSize(3)
    }

    @Test
    fun `should delete`() {
        controller.delete(person.id!!, firstDivorce.id!!)

        assertThat(person.getWeddingEvents()).hasSize(1)
    }
}
