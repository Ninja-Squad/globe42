package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.domain.Family
import org.globe42.domain.Location
import org.globe42.domain.Person
import org.globe42.domain.Relative
import org.globe42.domain.RelativeType
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.time.LocalDate

/**
 * Unit tests for [FamilyController]
 * @author JB Nizet
 */
class FamilyControllerTest {
    private val person = Person(42L)

    private val mockPersonDao = mockk<PersonDao> {
        every { findByIdOrNull(person.id!!) } returns person
    }

    private val controller = FamilyController(mockPersonDao)

    @Test
    fun `should get family of person`() {
        val relative = Relative().apply {
            id = 98
            type = RelativeType.CHILD
            firstName = "John"
            birthDate = LocalDate.of(2000, 11, 23)
            location = Location.ABROAD
        }

        val family = Family().apply {
            id = 56L
            spouseLocation = Location.FRANCE
            addRelative(relative)
        }
        person.family = family

        val result = controller.get(person.id!!)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        with(result.body!!) {
            assertThat(spouseLocation).isEqualTo(family.spouseLocation)
            assertThat(relatives).hasSize(1)
            with(relatives.get(0)) {
                assertThat(type).isEqualTo(relative.type)
                assertThat(firstName).isEqualTo(relative.firstName)
                assertThat(birthDate).isEqualTo(relative.birthDate)
                assertThat(location).isEqualTo(relative.location)
            }
        }
    }

    @Test
    fun `should throw if person does not exist`() {
        val nonExistingId = 8655L
        every { mockPersonDao.findByIdOrNull(nonExistingId) } returns null
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.get(nonExistingId)
        }
    }

    @Test
    fun `should return no content if person has no family`() {
        val result = controller.get(person.id!!)

        assertThat(result.statusCode).isEqualTo(HttpStatus.NO_CONTENT)
        assertThat(result.body).isNull()
    }

    @Test
    fun `should save family`() {
        val relativeDTO = RelativeDTO(
            RelativeType.CHILD,
            "John",
            LocalDate.of(2000, 11, 23),
            Location.ABROAD
        )
        val command = FamilyCommand(
            spouseLocation = Location.FRANCE,
            relatives = setOf(relativeDTO)
        )
        controller.save(person.id!!, command)

        with(person.family!!) {
            assertThat(spouseLocation).isEqualTo(command.spouseLocation)
            assertThat(getRelatives()).hasSize(1)
            with(getRelatives().first()) {
                assertThat(family).isEqualTo(person.family)
                assertThat(type).isEqualTo(relativeDTO.type)
                assertThat(firstName).isEqualTo(relativeDTO.firstName)
                assertThat(birthDate).isEqualTo(relativeDTO.birthDate)
                assertThat(location).isEqualTo(relativeDTO.location)
            }
        }
    }

    @Test
    fun `should delete family`() {
        person.family = Family()

        controller.delete(person.id!!)

        assertThat(person.family).isNull()
    }
}
