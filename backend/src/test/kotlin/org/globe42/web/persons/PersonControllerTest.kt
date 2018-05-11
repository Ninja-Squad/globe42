package org.globe42.web.persons

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.never
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.globe42.test.BaseTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.ArgumentMatchers.anyChar
import org.mockito.Captor
import org.mockito.InjectMocks
import org.mockito.Mock
import java.time.LocalDate
import java.util.*

/**
 * Unit tests for PersonController
 * @author JB Nizet
 */
class PersonControllerTest : BaseTest() {

    @Mock
    private lateinit var mockPersonDao: PersonDao

    @Mock
    private lateinit var mockCoupleDao: CoupleDao

    @Mock
    private lateinit var mockCountryDao: CountryDao

    @InjectMocks
    private lateinit var controller: PersonController

    @Captor
    private lateinit var personArgumentCaptor: ArgumentCaptor<Person>

    @Captor
    private lateinit var coupleArgumentCaptor: ArgumentCaptor<Couple>

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(1L, "John", "Doe", Gender.MALE)
        person.mediationCode = "A2"

        whenever(mockCountryDao.findById(any())).thenAnswer { invocation ->
            Optional.of(
                Country(
                    invocation.getArgument(0),
                    "Country " + invocation.getArgument<Any>(0)
                )
            )
        }
    }

    @Test
    fun `should list`() {
        whenever(mockPersonDao.findNotDeleted()).thenReturn(listOf<Person>(person))

        val result = controller.list()

        assertThat(result).extracting<Long>(PersonIdentityDTO::id).containsExactly(1L)
    }

    @Test
    fun `should list deleted`() {
        whenever(mockPersonDao.findDeleted()).thenReturn(listOf<Person>(person))

        val result = controller.listDeleted()

        assertThat(result).extracting<Long>(PersonIdentityDTO::id).containsExactly(1L)
    }

    @Test
    fun `should get`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        val (identity) = controller.get(person.id!!)

        assertThat(identity.id).isEqualTo(person.id!!)
    }

    @Test
    fun `should throw if not found when getting`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(person.id!!) }
    }

    @Test
    fun `should create`() {
        val command = createCommand()

        whenever(mockPersonDao.save(any<Person>())).thenReturnModifiedFirstArgument<Person> { it.id = 42L }
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        val result = controller.create(command)

        verify(mockPersonDao).save(personArgumentCaptor.capture())
        val savedPerson = personArgumentCaptor.value
        assertPersonEqualsCommand(savedPerson, command)
        assertThat(result.identity.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should create with lowercase last name`() {
        val command = createCommand("lacote")

        whenever(mockPersonDao.save(any<Person>())).thenReturnModifiedFirstArgument<Person> { it.id = 42L }
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        assertThat(controller.create(command).identity.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should create with last name starting with bizarre letter`() {
        val command = createCommand("\$foo")

        whenever(mockPersonDao.save(any<Person>())).thenReturnModifiedFirstArgument<Person> { it.id = 42L }
        whenever(mockPersonDao.nextMediationCode('Z')).thenReturn(76)

        assertThat(controller.create(command).identity.mediationCode).isEqualTo("Z76")
    }

    @Test
    fun `should not generate mediation code if mediation disabled`() {
        val command = createCommand("lacote", false, null)

        whenever(mockPersonDao.save(any<Person>())).thenReturnModifiedFirstArgument<Person> { it.id = 42L }

        assertThat(controller.create(command).identity.mediationCode).isNull()
    }

    @Test
    fun `should create with spouse`() {
        val spouseId = 200L
        val command = createCommand("Lacote", true, spouseId)

        val agnes = Person(spouseId, "Agnes", "Crepet", Gender.FEMALE)
        whenever(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes))
        whenever(mockPersonDao.save(any<Person>())).thenReturnModifiedFirstArgument<Person> { it.id = 42L }
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        controller.create(command)

        verify(mockPersonDao).save(personArgumentCaptor.capture())
        verify<CoupleDao>(mockCoupleDao).save(coupleArgumentCaptor.capture())

        val savedPerson = personArgumentCaptor.value
        assertPersonEqualsCommand(savedPerson, command)
        assertThat(savedPerson.spouse).isEqualTo(agnes)
        assertThat(agnes.spouse).isEqualTo(savedPerson)
    }

    @Test
    fun `should update`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)
        val command = createCommand()
        controller.update(person.id!!, command)

        assertPersonEqualsCommand(person, command)
        assertThat(person.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should update when no nationality`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)
        val command = createCommandWithNoNationality()
        controller.update(person.id!!, command)

        assertPersonEqualsCommand(person, command)
        assertThat(person.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should not update mediation code if letter stays the same`() {
        person.mediationCode = "L42"
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        val command = createCommand()

        controller.update(person.id!!, command)

        assertPersonEqualsCommand(person, command)
        assertThat(person.mediationCode).isEqualTo("L42")
        verify(mockPersonDao, never()).nextMediationCode(anyChar())
    }

    @Test
    fun `should create mediation code if mediation enabled and not before`() {
        person.mediationCode = null
        person.mediationEnabled = false
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        val command = createCommand()

        controller.update(person.id!!, command)

        assertPersonEqualsCommand(person, command)
        assertThat(person.mediationCode!!).isEqualTo("L37")
    }

    @Test
    fun `should update with spouse when no spouse before`() {
        val spouseId = 200L
        val command = createCommand("Lacote", true, spouseId)

        val agnes = Person(spouseId)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes))
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        controller.update(person.id!!, command)

        verify<CoupleDao>(mockCoupleDao).save(coupleArgumentCaptor.capture())
        assertThat(person.spouse).isEqualTo(agnes)
        assertThat(agnes.spouse).isEqualTo(person)
    }

    @Test
    fun `should update with spouse when other spouse before`() {
        val spouseId = 200L
        val command = createCommand("Lacote", true, spouseId)

        val previousSpouse = Person(100L)
        val previousCouple = Couple(person, previousSpouse)
        person.couple = previousCouple

        val agnes = Person(spouseId)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes))
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        controller.update(person.id!!, command)

        verify<CoupleDao>(mockCoupleDao).delete(previousCouple)
        verify<CoupleDao>(mockCoupleDao).save(coupleArgumentCaptor.capture())
        assertThat(person.spouse).isEqualTo(agnes)
        assertThat(agnes.spouse).isEqualTo(person)
        assertThat(previousSpouse.spouse).isNull()
    }

    @Test
    fun `should update without spouse when other spouse before`() {
        val command = createCommand("Lacote", true, null)

        val previousSpouse = Person(100L)
        val previousCouple = Couple(person, previousSpouse)
        person.couple = previousCouple

        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        controller.update(person.id!!, command)

        verify<CoupleDao>(mockCoupleDao).delete(previousCouple)
        assertThat(person.spouse).isNull()
        assertThat(previousSpouse.spouse).isNull()
    }

    @Test
    fun `should delete couple of new spouse`() {
        val spouseId = 200L
        val command = createCommand("Lacote", true, spouseId)

        val agnes = Person(spouseId)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes))
        whenever(mockPersonDao.nextMediationCode('L')).thenReturn(37)

        val previousSpouseOfAgnes = Person(100L)
        val previousCoupleOfAgnes = Couple(person, previousSpouseOfAgnes)

        controller.update(person.id!!, command)

        verify<CoupleDao>(mockCoupleDao).save(coupleArgumentCaptor.capture())
        assertThat(person.spouse).isEqualTo(agnes)
        assertThat(agnes.spouse).isEqualTo(person)

        assertThat(previousSpouseOfAgnes.spouse).isNull()
        verify<CoupleDao>(mockCoupleDao).delete(previousCoupleOfAgnes)
    }

    @Test
    fun `should throw if not found when updating`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(
                person.id!!,
                createCommand()
            )
        }
    }

    @Test
    fun `should delete`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        controller.delete(person.id!!)

        assertThat(person.deleted).isTrue()
    }

    @Test
    fun `should throw if not found when deleting`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.delete(person.id!!) }
    }

    @Test
    fun `should resurrect`() {
        person.deleted = true
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        controller.resurrect(person.id!!)

        assertThat(person.deleted).isFalse()
    }

    @Test
    fun `should throw if not found when resurrecting`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.resurrect(person.id!!) }
    }

    private fun assertPersonEqualsCommand(person: Person, command: PersonCommandDTO) {
        assertThat(person.firstName).isEqualTo(command.firstName)
        assertThat(person.lastName).isEqualTo(command.lastName)
        assertThat(person.birthName).isEqualTo(command.birthName)
        assertThat(person.nickName).isEqualTo(command.nickName)
        assertThat(person.birthDate).isEqualTo(command.birthDate)
        assertThat(person.address).isEqualTo(command.address)
        assertThat(person.city!!.code).isEqualTo(command.city!!.code)
        assertThat(person.city!!.city).isEqualTo(command.city!!.city)
        assertThat(person.email).isEqualTo(command.email)
        assertThat(person.entryDate).isEqualTo(command.entryDate)
        assertThat(person.gender).isEqualTo(command.gender)
        assertThat(person.phoneNumber).isEqualTo(command.phoneNumber)
        assertThat(person.maritalStatus).isEqualTo(command.maritalStatus)
        if (command.spouseId == null) {
            assertThat(person.spouse).isNull()
        } else {
            assertThat(person.spouse!!.id).isEqualTo(command.spouseId!!)
        }
        assertThat(person.housing).isEqualTo(command.housing)
        assertThat(person.housingSpace).isEqualTo(command.housingSpace)
        assertThat(person.hostName).isEqualTo(command.hostName)
        assertThat(person.fiscalStatus).isEqualTo(command.fiscalStatus)
        assertThat(person.fiscalNumber).isEqualTo(command.fiscalNumber)
        assertThat(person.fiscalStatusUpToDate).isEqualTo(command.fiscalStatusUpToDate)
        assertThat(person.healthCareCoverage).isEqualTo(command.healthCareCoverage)
        assertThat(person.healthCareCoverageStartDate).isEqualTo(command.healthCareCoverageStartDate)
        assertThat(person.healthInsurance).isEqualTo(command.healthInsurance)
        assertThat(person.healthInsuranceStartDate).isEqualTo(command.healthInsuranceStartDate)
        assertThat(person.accompanying).isEqualTo(command.accompanying)
        assertThat(person.socialSecurityNumber).isEqualTo(command.socialSecurityNumber)
        assertThat(person.cafNumber).isEqualTo(command.cafNumber)
        if (command.nationalityId == null) {
            assertThat(person.nationality).isNull()
        } else {
            assertThat(person.nationality!!.id).isEqualTo(command.nationalityId)
        }
    }

    companion object {

        internal fun createCommandWithNoNationality(): PersonCommandDTO {
            return createCommand("Lacote", true, null, null)
        }

        @JvmOverloads
        internal fun createCommand(
            lastName: String = "Lacote",
            mediationEnabled: Boolean = true,
            spouseId: Long? = null,
            nationalityId: String? = "FRA"
        ): PersonCommandDTO {
            return PersonCommandDTO(
                firstName = "Cyril",
                lastName = lastName,
                birthName = "Lacote du chateau",
                nickName = "CEO, Bitch",
                birthDate = LocalDate.of(1977, 9, 12),
                address = "somewhere",
                city = CityDTO("42000", "Saint-Etienne"),
                email = "cyril@ninja-squad.com",
                entryDate = LocalDate.of(2017, 4, 13),
                gender = Gender.MALE,
                phoneNumber = "01234567",
                mediationEnabled = mediationEnabled,
                firstMediationAppointmentDate = LocalDate.of(2017, 12, 1),
                maritalStatus = MaritalStatus.CONCUBINAGE,
                spouseId = spouseId,
                housing = Housing.F3,
                housingSpace = 70,
                hostName = "Bruno Mala",
                fiscalStatus = FiscalStatus.TAXABLE,
                fiscalNumber = "0123456789012",
                fiscalStatusUpToDate = true,
                healthCareCoverage = HealthCareCoverage.GENERAL,
                healthCareCoverageStartDate = LocalDate.of(2016, 1, 1),
                healthInsurance = HealthInsurance.MUTUELLE,
                healthInsuranceStartDate = LocalDate.of(2017, 1, 1),
                accompanying = "Nadia DURAND",
                socialSecurityNumber = "277126912340454",
                cafNumber = "123765",
                nationalityId = nationalityId
            )
        }
    }
}
