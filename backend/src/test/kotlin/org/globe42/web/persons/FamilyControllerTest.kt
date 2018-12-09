package org.globe42.web.persons

import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.domain.Child
import org.globe42.domain.Family
import org.globe42.domain.Location
import org.globe42.domain.Person
import org.globe42.test.Mockito
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.springframework.http.HttpStatus
import java.time.LocalDate
import java.util.*

/**
 * Unit tests for [FamilyController]
 * @author JB Nizet
 */
@Mockito
class FamilyControllerTest {
    @Mock
    private lateinit var mockPersonDao: PersonDao

    @InjectMocks
    private lateinit var controller: FamilyController

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun `should get family of person`() {
        val child = Child().apply {
            id = 98
            firstName = "John"
            birthDate = LocalDate.of(2000, 11, 23)
            location = Location.ABROAD
        }

        val family = Family().apply {
            id = 56L;
            spouseLocation = Location.FRANCE
            addChild(child)
        }
        person.family = family

        val result = controller.get(person.id!!)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        with(result.body!!) {
            assertThat(spouseLocation).isEqualTo(family.spouseLocation)
            assertThat(children).hasSize(1)
            with(children.get(0)) {
                assertThat(firstName).isEqualTo(child.firstName)
                assertThat(birthDate).isEqualTo(child.birthDate)
                assertThat(location).isEqualTo(child.location)
            }
        }
    }

    @Test
    fun `should throw if person does not exist`() {
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.get(8655L)
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
        val childDTO = ChildDTO(
            "John",
            LocalDate.of(2000, 11, 23),
            Location.ABROAD
        )
        val command = FamilyCommand(
            spouseLocation = Location.FRANCE,
            children = setOf(childDTO)
        )
        controller.save(person.id!!, command)

        with(person.family!!) {
            assertThat(spouseLocation).isEqualTo(command.spouseLocation)
            assertThat(getChildren()).hasSize(1)
            with(getChildren().first()) {
                assertThat(family).isEqualTo(person.family)
                assertThat(firstName).isEqualTo(childDTO.firstName)
                assertThat(birthDate).isEqualTo(childDTO.birthDate)
                assertThat(location).isEqualTo(childDTO.location)
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
