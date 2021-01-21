package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDate

/**
 * Unit tests for PersonController
 * @author JB Nizet
 */
class PersonControllerTest {

    private val mockPersonDao = mockk<PersonDao>()

    private val mockCoupleDao = mockk<CoupleDao>(relaxUnitFun = true)

    private val mockCountryDao = mockk<CountryDao>()

    private val controller = PersonController(mockPersonDao, mockCoupleDao, mockCountryDao)

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(1L, "John", "Doe", Gender.MALE)
        person.mediationCode = "A2"

        every { mockCountryDao.findByIdOrNull(any()) } answers {
            val id = arg<String>(0)
            Country(
                id,
                "Country $id"
            )
        }

        every { mockCoupleDao.save(any<Couple>()) } answers { arg<Couple>(0) }
    }

    @Test
    fun `should list`() {
        every { mockPersonDao.findNotDeleted() } returns listOf(person)

        val result = controller.list()

        assertThat(result).extracting<Long>(PersonIdentityDTO::id).containsExactly(1L)
    }

    @Test
    fun `should list deleted`() {
        every { mockPersonDao.findDeleted() } returns listOf(person)

        val result = controller.listDeleted()

        assertThat(result).extracting<Long>(PersonIdentityDTO::id).containsExactly(1L)
    }

    @Test
    fun `should get`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        val (identity) = controller.get(person.id!!)

        assertThat(identity.id).isEqualTo(person.id!!)
    }

    @Test
    fun `should throw if not found when getting`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(person.id!!) }
    }

    @Test
    fun `should create`() {
        val command = createCommand()

        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 42L } }
        every { mockPersonDao.nextMediationCode('L') } returns 37

        val result = controller.create(command)

        verify {
            mockPersonDao.save(withArg<Person> {
                assertPersonEqualsCommand(it, command)
            })
        }

        assertThat(result.identity.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should create with lowercase last name`() {
        val command = createCommand("lacote")

        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 42L } }
        every { mockPersonDao.nextMediationCode('L') } returns 37

        assertThat(controller.create(command).identity.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should create with last name starting with bizarre letter`() {
        val command = createCommand("\$foo")

        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 42L } }
        every { mockPersonDao.nextMediationCode('Z') } returns 76

        assertThat(controller.create(command).identity.mediationCode).isEqualTo("Z76")
    }

    @Test
    fun `should not generate mediation code if mediation disabled`() {
        val command = createCommand("lacote", false, null)

        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 42L } }

        assertThat(controller.create(command).identity.mediationCode).isNull()
    }

    @Test
    fun `should create with spouse`() {
        val spouseId = 200L
        val command = createCommand(lastName = "Lacote", mediationEnabled = true, spouseId = spouseId)

        val agnes = Person(spouseId, "Agnes", "Crepet", Gender.FEMALE)
        every { mockPersonDao.findByIdOrNull(spouseId) } returns agnes
        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 42L } }
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.create(command)

        verify {
            mockPersonDao.save(withArg<Person> {
                assertPersonEqualsCommand(it, command)
                assertThat(it.spouse).isEqualTo(agnes)
                assertThat(agnes.spouse).isEqualTo(it)
            })
            mockCoupleDao.save(any<Couple>())
        }
    }

    @Test
    fun `should create with partner`() {
        val command = createCommand(partner = "old friend")

        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 42L } }
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.create(command)

        verify {
            mockPersonDao.save(withArg<Person> {
                assertThat(it.partner).isEqualTo("old friend")
            })
        }
    }

    @Test
    fun `should create with blank partner`() {
        val command = createCommand(partner = "   ")

        every { mockPersonDao.save(any<Person>()) } answers { arg<Person>(0).apply { id = 42L } }
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.create(command)

        verify {
            mockPersonDao.save(withArg<Person> {
                assertThat(it.partner).isNull()
            })
        }
    }

    @Test
    fun `should update`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.nextMediationCode('L') } returns 37
        val command = createCommand()
        controller.update(person.id!!, command)

        assertPersonEqualsCommand(person, command)
        assertThat(person.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should update when no nationality`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.nextMediationCode('L') } returns 37
        val command = createCommandWithNoNationality()
        controller.update(person.id!!, command)

        assertPersonEqualsCommand(person, command)
        assertThat(person.mediationCode).isEqualTo("L37")
    }

    @Test
    fun `should update when no passport`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.nextMediationCode('L') } returns 37
        val command = createCommand(passportStatus = PassportStatus.NO_PASSPORT)
        controller.update(person.id!!, command)

        assertThat(person.passportNumber).isNull()
        assertThat(person.passportValidityStartDate).isNull()
        assertThat(person.passportValidityEndDate).isNull()
    }

    @Test
    fun `should not update mediation code if letter stays the same`() {
        person.mediationCode = "L42"
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        val command = createCommand()

        controller.update(person.id!!, command)

        assertPersonEqualsCommand(person, command)
        assertThat(person.mediationCode).isEqualTo("L42")
        verify(inverse = true) { mockPersonDao.nextMediationCode(any()) }
    }

    @Test
    fun `should create mediation code if mediation enabled and not before`() {
        person.mediationCode = null
        person.mediationEnabled = false
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.nextMediationCode('L') } returns 37

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
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.findByIdOrNull(spouseId) } returns agnes
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.update(person.id!!, command)

        verify { mockCoupleDao.save(any<Couple>()) }
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
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.findByIdOrNull(spouseId) } returns agnes
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.update(person.id!!, command)

        verify {
            mockCoupleDao.delete(previousCouple)
            mockCoupleDao.save(any<Couple>())
        }
        assertThat(person.spouse).isEqualTo(agnes)
        assertThat(agnes.spouse).isEqualTo(person)
        assertThat(previousSpouse.spouse).isNull()
    }

    @Test
    fun `should update with spouse when partner before`() {
        person.partner = "old friend"
        val spouseId = 200L
        val command = createCommand("Lacote", true, spouseId)

        val agnes = Person(spouseId)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.findByIdOrNull(spouseId) } returns agnes
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.update(person.id!!, command)

        assertThat(person.partner).isNull()
    }

    @Test
    fun `should update without spouse when other spouse before`() {
        val command = createCommand("Lacote", true, null)

        val previousSpouse = Person(100L)
        val previousCouple = Couple(person, previousSpouse)
        person.couple = previousCouple

        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.update(person.id!!, command)

        verify { mockCoupleDao.delete(previousCouple) }
        assertThat(person.spouse).isNull()
        assertThat(previousSpouse.spouse).isNull()
    }

    @Test
    fun `should delete couple of new spouse`() {
        val spouseId = 200L
        val command = createCommand("Lacote", true, spouseId)

        val agnes = Person(spouseId)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.findByIdOrNull(spouseId) } returns agnes
        every { mockPersonDao.nextMediationCode('L') } returns 37

        val previousSpouseOfAgnes = Person(100L)
        val previousCoupleOfAgnes = Couple(person, previousSpouseOfAgnes)

        controller.update(person.id!!, command)

        verify { mockCoupleDao.save(any<Couple>()) }
        assertThat(person.spouse).isEqualTo(agnes)
        assertThat(agnes.spouse).isEqualTo(person)

        assertThat(previousSpouseOfAgnes.spouse).isNull()
        verify { mockCoupleDao.delete(previousCoupleOfAgnes) }
    }

    @Test
    fun `should drop partner of new spouse`() {
        val spouseId = 200L
        val command = createCommand("Lacote", true, spouseId)

        val agnes = Person(spouseId).apply { partner = "old friend" }

        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.findByIdOrNull(spouseId) } returns agnes
        every { mockPersonDao.nextMediationCode('L') } returns 37

        controller.update(person.id!!, command)

        verify { mockCoupleDao.save(any<Couple>()) }
        assertThat(person.spouse).isEqualTo(agnes)
        assertThat(agnes.spouse).isEqualTo(person)
        assertThat(agnes.partner).isNull()
    }

    @Test
    fun `should throw if not found when updating`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(
                person.id!!,
                createCommand()
            )
        }
    }

    @Test
    fun `should delete`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        controller.delete(person.id!!)

        assertThat(person.deleted).isTrue()
    }

    @Test
    fun `should throw if not found when deleting`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.delete(person.id!!) }
    }

    @Test
    fun `should resurrect`() {
        person.deleted = true
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        controller.resurrect(person.id!!)

        assertThat(person.deleted).isFalse()
    }

    @Test
    fun `should throw if not found when resurrecting`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null

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
        assertThat(person.entryType).isEqualTo(command.entryType)
        assertThat(person.gender).isEqualTo(command.gender)
        assertThat(person.phoneNumber).isEqualTo(command.phoneNumber)
        assertThat(person.maritalStatus).isEqualTo(command.maritalStatus)
        if (command.spouseId == null) {
            assertThat(person.spouse).isNull()
            assertThat(person.partner).isNull()
        } else {
            assertThat(person.spouse!!.id).isEqualTo(command.spouseId!!)
            assertThat(person.partner).isEqualTo(command.partner?.takeIf { it.isNotBlank() })
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
        assertThat(person.lastHealthCheckDate).isEqualTo(command.lastHealthCheckDate)
        assertThat(person.accompanying).isEqualTo(command.accompanying)
        assertThat(person.socialSecurityNumber).isEqualTo(command.socialSecurityNumber)
        assertThat(person.cafNumber).isEqualTo(command.cafNumber)
        if (command.nationalityId == null) {
            assertThat(person.nationality).isNull()
        } else {
            assertThat(person.nationality!!.id).isEqualTo(command.nationalityId)
        }

        assertThat(person.passportStatus).isEqualTo(command.passportStatus)
        assertThat(person.passportNumber).isEqualTo(command.passportNumber)
        assertThat(person.passportValidityStartDate).isEqualTo(command.passportValidityStartDate)
        assertThat(person.passportValidityEndDate).isEqualTo(command.passportValidityEndDate)
        assertThat(person.visa).isEqualTo(command.visa)
        assertThat(person.residencePermit).isEqualTo(command.residencePermit)
        assertThat(person.residencePermitDepositDate).isEqualTo(command.residencePermitDepositDate)
        assertThat(person.residencePermitRenewalDate).isEqualTo(command.residencePermitRenewalDate)
        assertThat(person.residencePermitValidityStartDate).isEqualTo(command.residencePermitValidityStartDate)
        assertThat(person.residencePermitValidityEndDate).isEqualTo(command.residencePermitValidityEndDate)
        assertThat(person.schoolLevel).isEqualTo(command.schoolLevel)
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
            nationalityId: String? = "FRA",
            partner: String? = null,
            passportStatus: PassportStatus = PassportStatus.PASSPORT
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
                entryType = EntryType.REGULAR,
                gender = Gender.MALE,
                phoneNumber = "01234567",
                mediationEnabled = mediationEnabled,
                firstMediationAppointmentDate = LocalDate.of(2017, 12, 1),
                maritalStatus = MaritalStatus.CONCUBINAGE,
                spouseId = spouseId,
                partner = partner,
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
                lastHealthCheckDate = LocalDate.of(2019, 1, 1),
                accompanying = "Nadia DURAND",
                socialSecurityNumber = "277126912340454",
                cafNumber = "123765",
                nationalityId = nationalityId,
                passportStatus = passportStatus,
                passportNumber = "P1",
                passportValidityStartDate = LocalDate.of(2019, 9, 1),
                passportValidityEndDate = LocalDate.of(2024, 9, 1),
                visa = Visa.SHORT_STAY,
                residencePermit = ResidencePermit.TEN_YEAR_OLD_RESIDENT,
                residencePermitDepositDate = LocalDate.of(2017, 12, 1),
                residencePermitRenewalDate = LocalDate.of(2019, 12, 1),
                residencePermitValidityStartDate = LocalDate.of(2018, 12, 1),
                residencePermitValidityEndDate = LocalDate.of(2028, 12, 1),
                schoolLevel = SchoolLevel.HIGH
            )
        }
    }
}
