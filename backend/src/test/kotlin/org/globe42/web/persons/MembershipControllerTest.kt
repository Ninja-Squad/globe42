package org.globe42.web.persons

import com.nhaarman.mockitokotlin2.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.globe42.test.BaseTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.springframework.http.HttpStatus
import java.time.LocalDate
import java.util.*

/**
 * Unit tests for [MembershipController]
 * @author JB Nizet
 */
class MembershipControllerTest : BaseTest() {
    @Mock
    lateinit var mockMembershipDao: MembershipDao

    @Mock
    lateinit var mockPersonDao: PersonDao

    @InjectMocks
    lateinit var controller: MembershipController

    lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun `should list`() {
        whenever(mockMembershipDao.findByPerson(person)).thenReturn(
            listOf(
                Membership(2L, person, 2018, LocalDate.of(2018, 1, 31), PaymentMode.CASH, "002"),
                Membership(1L, person, 2017, LocalDate.of(2017, 1, 31), PaymentMode.UNKNOWN, "001")
            )
        )

        val result = controller.list(person.id!!)
        assertThat(result).hasSize(2)
        assertThat(result[0]).isEqualTo(
            MembershipDTO(
                2L,
                2018,
                PaymentMode.CASH,
                LocalDate.of(2018, 1, 31),
                "002"
            )
        )
    }

    @Test
    fun `should throw when listing for person that does not exist`() {
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.list(456L)
        }
    }

    @Test
    fun `should get current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        whenever(mockMembershipDao.findByPersonAndYear(person, currentYear)).thenReturn(
            Optional.of(
                Membership(
                    2L,
                    person,
                    currentYear,
                    LocalDate.of(currentYear, 1, 31),
                    PaymentMode.CASH,
                    "002"
                )
            )
        )
        val result = controller.getCurrentMembership(person.id!!)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(result.body).isEqualTo(
            MembershipDTO(
                2L,
                currentYear,
                PaymentMode.CASH,
                LocalDate.of(currentYear, 1, 31),
                "002"
            )
        )
    }

    @Test
    fun `should throw when getting current membership of person that doesn't exist`() {
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.getCurrentMembership(345L)
        }
    }

    @Test
    fun `should return empty content when getting current membership of person that doesn't have a current membership`() {
        val result = controller.getCurrentMembership(person.id!!)
        assertThat(result.statusCode).isEqualTo(HttpStatus.NO_CONTENT)
        assertThat(result.body).isNull()
    }

    @Test
    fun `should create membership`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CASH,
            LocalDate.of(2018, 1, 31),
            "002"
        )
        whenever(mockMembershipDao.save(any<Membership>())).thenReturnModifiedFirstArgument<Membership> {
            it.id = 42L
        }

        val result = controller.create(person.id!!, command)
        assertThat(result).isEqualTo(
            MembershipDTO(
                42L,
                2018,
                PaymentMode.CASH,
                LocalDate.of(2018, 1, 31),
                "002"
            )
        )

        verify(mockMembershipDao).save(argThat<Membership> { this.person === person })
    }

    @Test
    fun `should update membership`() {
        val membership = Membership(42L, person, 2018, LocalDate.of(2018, 1, 1), PaymentMode.CASH, "0")
        whenever(mockMembershipDao.findById(membership.id!!)).thenReturn(Optional.of(membership))

        val command = MembershipCommandDTO(
            2017, // should be ignored
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 31),
            "002"
        )

        controller.update(person.id!!, membership.id!!, command)
        assertThat(membership.year).isEqualTo(2018)
        assertThat(membership.person).isEqualTo(person)
        assertThat(membership.paymentMode).isEqualTo(command.paymentMode)
        assertThat(membership.paymentDate).isEqualTo(command.paymentDate)
        assertThat(membership.cardNumber).isEqualTo(command.cardNumber)
    }

    @Test
    fun `should throw when updating membership that doesn't exist`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 31),
            "002"
        )

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, 345L, command)
        }
    }

    @Test
    fun `should throw when updating membership that doesn't belong to the given person`() {
        val otherPerson = Person(765L)
        val membership = Membership(42L, otherPerson, 2018, LocalDate.of(2018, 1, 1), PaymentMode.CASH, "0")
        whenever(mockMembershipDao.findById(membership.id!!)).thenReturn(Optional.of(membership))

        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 31),
            "002"
        )

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, membership.id!!, command)
        }
    }

    @Test
    fun `should delete membership`() {
        val membership = Membership(42L, person, 2018, LocalDate.of(2018, 1, 1), PaymentMode.CASH, "0")
        whenever(mockMembershipDao.findById(membership.id!!)).thenReturn(Optional.of(membership))

        controller.delete(person.id!!, membership.id!!)

        verify(mockMembershipDao).delete(membership)
    }

    @Test
    fun `should throw when deleting membership of person that doesn't exist`() {
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.delete(345L, 567L)
        }
    }

    @Test
    fun `should do nothing when deleting membership that doesn't exist`() {
        controller.delete(person.id!!, 567L)

        verify(mockMembershipDao, never()).delete(any())
    }
}
