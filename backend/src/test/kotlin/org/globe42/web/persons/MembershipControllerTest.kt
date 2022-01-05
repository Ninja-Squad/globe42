package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Gender
import org.globe42.domain.Membership
import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.domain.PaymentMode
import org.globe42.domain.Person
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.time.LocalDate

/**
 * Unit tests for [MembershipController]
 * @author JB Nizet
 */
class MembershipControllerTest {
    private val mockMembershipDao = mockk<MembershipDao>(relaxUnitFun = true)
    private val mockPersonDao = mockk<PersonDao>()
    private val mockMembershipFormGenerator = mockk<MembershipFormGenerator>()

    private val controller = MembershipController(mockPersonDao, mockMembershipDao, mockMembershipFormGenerator)

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L, "John", "Doe", Gender.MALE)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
    }

    @Test
    fun `should list`() {
        every { mockMembershipDao.findByPerson(person) } returns
            listOf(
                Membership(2L, person, 2018, LocalDate.of(2018, 1, 31), PaymentMode.CASH, 2),
                Membership(1L, person, 2017, LocalDate.of(2017, 1, 31), PaymentMode.UNKNOWN, 1)
            )

        val result = controller.list(person.id!!)
        assertThat(result).hasSize(2)
        assertThat(result[0]).isEqualTo(
            MembershipDTO(
                2L,
                2018,
                PaymentMode.CASH,
                LocalDate.of(2018, 1, 31),
                2
            )
        )
    }

    @Test
    fun `should throw when listing for person that does not exist`() {
        every { mockPersonDao.findByIdOrNull(456L) } returns null
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.list(456L)
        }
    }

    @Test
    fun `should get current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        every { mockMembershipDao.findByPersonAndYear(person, currentYear) } returns
            Membership(
                id = 2L,
                person = person,
                year = currentYear,
                paymentDate = LocalDate.of(currentYear, 1, 31),
                paymentMode = PaymentMode.CASH,
                cardNumber = 2
            )

        val result = controller.getCurrentMembership(person.id!!)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(result.body).isEqualTo(
            MembershipDTO(
                2L,
                currentYear,
                PaymentMode.CASH,
                LocalDate.of(currentYear, 1, 31),
                2
            )
        )
    }

    @Test
    fun `should throw when getting current membership of person that doesn't exist`() {
        every { mockPersonDao.findByIdOrNull(345L) } returns null
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.getCurrentMembership(345L)
        }
    }

    @Test
    fun `should return empty content when getting current membership of person that doesn't have a current membership`() {
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        every { mockMembershipDao.findByPersonAndYear(person, currentYear) } returns null

        val result = controller.getCurrentMembership(person.id!!)
        assertThat(result.statusCode).isEqualTo(HttpStatus.NO_CONTENT)
        assertThat(result.body).isNull()
    }

    @Test
    fun `should create new membership with auto-generated card number`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CASH,
            LocalDate.of(2018, 1, 31),
            null
        )

        every { mockMembershipDao.findByPersonAndYear(person, command.year) } returns null
        every { mockMembershipDao.nextAvailableCardNumber(command.year) } returns 56
        every { mockMembershipDao.save(any<Membership>()) } answers { arg<Membership>(0).apply { id = 42L } }

        val result = controller.create(person.id!!, command)
        assertThat(result).isEqualTo(
            MembershipDTO(
                42L,
                2018,
                PaymentMode.CASH,
                LocalDate.of(2018, 1, 31),
                56
            )
        )

        verify {
            mockMembershipDao.save(withArg<Membership> { it.person === person })
        }
    }

    @Test
    fun `should create old membership with given card number`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CASH,
            LocalDate.of(2018, 1, 31),
            52
        )

        every { mockMembershipDao.findByPersonAndYear(person, command.year) } returns null
        every { mockMembershipDao.save(any<Membership>()) } answers { arg<Membership>(0).apply { id = 42L } }

        val result = controller.create(person.id!!, command)
        assertThat(result).isEqualTo(
            MembershipDTO(
                42L,
                2018,
                PaymentMode.CASH,
                LocalDate.of(2018, 1, 31),
                52
            )
        )

        verify {
            mockMembershipDao.save(withArg<Membership> { it.person === person })
        }
    }

    @Test
    fun `should update membership`() {
        val membership = Membership(42L, person, 2018, LocalDate.of(2018, 1, 1), PaymentMode.CASH, 42)
        every { mockMembershipDao.findByIdOrNull(membership.id!!) } returns membership

        val command = MembershipCommandDTO(
            2017, // should be ignored
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 31),
            43
        )

        controller.update(person.id!!, membership.id!!, command)
        assertThat(membership.year).isEqualTo(2018)
        assertThat(membership.person).isEqualTo(person)
        assertThat(membership.paymentMode).isEqualTo(command.paymentMode)
        assertThat(membership.paymentDate).isEqualTo(command.paymentDate)
        assertThat(membership.cardNumber).isEqualTo(43)
    }

    @Test
    fun `should throw when updating membership that doesn't exist`() {
        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 31),
            42
        )
        every { mockMembershipDao.findByIdOrNull(345L) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, 345L, command)
        }
    }

    @Test
    fun `should throw when updating membership that doesn't belong to the given person`() {
        val otherPerson = Person(765L)
        val membership = Membership(42L, otherPerson, 2018, LocalDate.of(2018, 1, 1), PaymentMode.CASH, 1)
        every { mockMembershipDao.findByIdOrNull(membership.id!!) } returns membership

        val command = MembershipCommandDTO(
            2018,
            PaymentMode.CHECK,
            LocalDate.of(2018, 1, 31),
            42
        )

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, membership.id!!, command)
        }
    }

    @Test
    fun `should delete membership`() {
        val membership = Membership(42L, person, 2018, LocalDate.of(2018, 1, 1), PaymentMode.CASH, 1)
        every { mockMembershipDao.findByIdOrNull(membership.id!!) } returns membership

        controller.delete(person.id!!, membership.id!!)

        verify { mockMembershipDao.delete(membership) }
    }

    @Test
    fun `should throw when deleting membership of person that doesn't exist`() {
        every { mockPersonDao.findByIdOrNull(345L) } returns null
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.delete(345L, 567L)
        }
    }

    @Test
    fun `should do nothing when deleting membership that doesn't exist`() {
        every { mockMembershipDao.findByIdOrNull(567L) } returns null
        controller.delete(person.id!!, 567L)

        verify(inverse = true) { mockMembershipDao.delete(any()) }
    }
}
