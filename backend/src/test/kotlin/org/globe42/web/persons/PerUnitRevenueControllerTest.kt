package org.globe42.web.persons

import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.domain.Gender
import org.globe42.domain.PerUnitRevenueInformation
import org.globe42.domain.Person
import org.globe42.test.Mockito
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.springframework.http.HttpStatus
import java.util.*

/**
 * Unit tests for [PerUnitRevenueController]
 * @author JB Nizet
 */
@Mockito
class PerUnitRevenueControllerTest {

    @Mock
    private lateinit var mockPersonDao: PersonDao

    @InjectMocks
    private lateinit var controller: PerUnitRevenueController

    @Test
    fun `should throw if no person`() {
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(42L) }
    }

    @Test
    fun `should return information if present`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        person.perUnitRevenueInformation = PerUnitRevenueInformation(2, 3, true)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        val result = controller.get(person.id!!).body
        assertThat(result).isEqualTo(PerUnitRevenueInformationDTO(2, 3, true))
    }

    @Test
    fun `should return null if absent`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        val result = controller.get(person.id!!)
        assertThat(result.statusCode).isEqualTo(HttpStatus.NO_CONTENT)
        assertThat(result.body).isNull()
    }

    @Test
    fun `should reset to null when deleting`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        person.perUnitRevenueInformation = PerUnitRevenueInformation(2, 3, true)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        controller.delete(person.id!!)

        assertThat(person.perUnitRevenueInformation).isNull()
    }

    @Test
    fun `should update`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        controller.update(person.id!!, PerUnitRevenueInformationDTO(2, 3, true))

        assertThat(person.perUnitRevenueInformation).isEqualTo(PerUnitRevenueInformation(2, 3, true))
    }
}
