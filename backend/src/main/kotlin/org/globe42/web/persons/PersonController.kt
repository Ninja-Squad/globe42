package org.globe42.web.persons

import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.City
import org.globe42.domain.Couple
import org.globe42.domain.Membership
import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.domain.PassportStatus
import org.globe42.domain.PaymentMode
import org.globe42.domain.Person
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import javax.transaction.Transactional

/**
 * REST controller for persons
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons"])
@Transactional
class PersonController(
    private val personDao: PersonDao,
    private val coupleDao: CoupleDao,
    private val countryDao: CountryDao,
    private val membershipDao: MembershipDao
) {

    @GetMapping
    fun list() = personDao.findNotDeleted().map(::PersonIdentityDTO)

    @GetMapping(params = ["deleted"])
    fun listDeleted() = personDao.findDeleted().map(::PersonIdentityDTO)

    @GetMapping("/{personId}")
    fun get(@PathVariable("personId") id: Long): PersonDTO {
        return personDao.findByIdOrNull(id)
            ?.let(::PersonDTO)
            ?: throw NotFoundException("No person with ID $id")
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Validated @RequestBody command: PersonCommandDTO): PersonDTO {
        val person = Person()
        copyCommandToPerson(command, person)

        if (person.mediationEnabled) {
            val mediationCodeLetter = mediationCodeLetter(person)
            person.mediationCode = mediationCodeLetter + personDao.nextMediationCode(mediationCodeLetter).toString()
        }

        return PersonDTO(personDao.save(person))
    }

    @PutMapping("/{personId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("personId") id: Long, @Validated @RequestBody command: PersonCommandDTO) {
        val person = personDao.findByIdOrNull(id) ?: throw NotFoundException("No person with ID $id")

        val oldMediationCodeLetter = person.mediationCode.let {
            if (it != null) it[0] else 0.toChar()
        }

        copyCommandToPerson(command, person)

        val newMediationCodeLetter = mediationCodeLetter(person)
        // if the mediation code letter changes, we change the code, unless the mediation is disabled,
        // in which case we set it to null.
        // if mediation is disabled and the letter doesn't change, we leave the code there, but
        // we don't transfer it to the client. So if mediation is reenabled, the person will keep the old
        // code.
        if (newMediationCodeLetter != oldMediationCodeLetter) {
            if (command.mediationEnabled) {
                person.mediationCode = newMediationCodeLetter +
                        personDao.nextMediationCode(newMediationCodeLetter).toString()
            } else {
                person.mediationCode = null
            }
        }
    }

    @DeleteMapping("/{personId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("personId") id: Long) {
        val person = personDao.findByIdOrNull(id) ?: throw NotFoundException("No person with ID $id")
        person.deleted = true
    }

    @DeleteMapping("/{personId}/deletion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun resurrect(@PathVariable("personId") id: Long) {
        val person = personDao.findByIdOrNull(id) ?: throw NotFoundException("No person with ID $id")
        person.deleted = false
    }

    @PutMapping("/{personId}/death")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun signalDeath(@PathVariable("personId") id: Long, @Validated @RequestBody command: PersonDeathCommandDTO) {
        val person = personDao.findByIdOrNull(id) ?: throw NotFoundException("No person with ID $id")
        person.deathDate = command.deathDate
        person.clearParticipations()
    }

    @GetMapping("/{personId}/reminders")
    fun reminders(@PathVariable("personId") id: Long): List<ReminderDTO> {
        val person = personDao.findByIdOrNull(id) ?: throw NotFoundException("No person with ID $id")
        return person.findReminders()
    }

    @GetMapping("/with-reminders")
    fun listWithReminders(): List<PersonWithRemindersDTO> {
        val persons = personDao.findNotDeleted()

        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        val currentYearMemberships = membershipDao.findByYear(currentYear).associateBy { it.person }

        return persons
            .map { person -> person to person.findReminders(currentYearMemberships) }
            .filter { (_, reminders) -> reminders.isNotEmpty() }
            .map { (person, reminders) ->
                PersonWithRemindersDTO(
                    identity = PersonIdentityDTO(person),
                    email = person.email,
                    phoneNumber = person.phoneNumber,
                    reminders = reminders
                )
            }
    }

    private fun Person.findReminders(currentYearMemberships: Map<Person, Membership>? = null): List<ReminderDTO> {
        if (deathDate != null || deleted) {
            return emptyList()
        }

        val today = LocalDate.now(PARIS_TIME_ZONE)
        val result = mutableListOf<ReminderDTO>()

        // health insurance to renew
        if (mediationEnabled) {
            healthInsuranceStartDate?.let { startDate ->
                val endDate = startDate.plus(HEALTH_INSURANCE_PERIOD)
                if (today.isAfter(endDate.minus(HEALTH_INSURANCE_DELAY_BEFORE_REMINDER))) {
                    result.add(HealthInsuranceToRenewDTO(endDate))
                }
            }

            // residence permit to renew
            residencePermitValidityEndDate?.let { endDate ->
                if (today.isAfter(endDate.minus(RESIDENCE_PERMIT_DELAY_BEFORE_REMINDER))) {
                    result.add(ResidencePermitToRenewDTO(endDate))
                }
            }

            // health check to plan
            lastHealthCheckDate?.let { lastDate ->
                if (today.isAfter(lastDate.plus(HEALTH_CHECK_PERIOD))) {
                    result.add(HealthCheckToPlanDTO(lastDate))
                }
            } ?: result.add(HealthCheckToPlanDTO(null))
        }

        // membership to renew / membership payment out of date
        val membership = if (currentYearMemberships != null) {
            currentYearMemberships[this]
        } else {
            membershipDao.findByPersonAndYear(this, today.year)
        }
        membership?.let {
            if (it.paymentMode == PaymentMode.OUT_OF_DATE) {
                result.add(MembershipPaymentOutOfDateDTO)
            }
        } ?: result.add(MembershipToRenewDTO)

        return result
    }

    private fun copyCommandToPerson(command: PersonCommandDTO, person: Person) {
        with(person) {
            firstName = command.firstName
            lastName = command.lastName
            birthName = command.birthName
            nickName = command.nickName
            birthDate = command.birthDate
            address = command.address
            city = command.city?.let { City(it.code, it.city) }
            email = command.email
            gender = command.gender
            phoneNumber = command.phoneNumber
            mediationEnabled = command.mediationEnabled

            // if mediation is disabled, we leave all the mediation-related elements as is
            // in case mediation is re-enabled later, to not lose valuable information.
            if (command.mediationEnabled) {
                entryDate = command.entryDate
                entryType = command.entryType
                firstMediationAppointmentDate = command.firstMediationAppointmentDate
                maritalStatus = command.maritalStatus
                housing = command.housing
                housingSpace = command.housingSpace
                hostName = command.hostName
                fiscalStatus = command.fiscalStatus
                fiscalNumber = command.fiscalNumber
                fiscalStatusUpToDate = command.fiscalStatusUpToDate
                healthCareCoverage = command.healthCareCoverage
                healthCareCoverageStartDate = command.healthCareCoverageStartDate
                healthInsurance = command.healthInsurance
                healthInsuranceStartDate = command.healthInsuranceStartDate
                lastHealthCheckDate = command.lastHealthCheckDate
                accompanying = command.accompanying
                socialSecurityNumber = command.socialSecurityNumber
                cafNumber = command.cafNumber
                nationality = command.nationalityId?.let {
                    countryDao.findByIdOrNull(it)
                        ?: throw BadRequestException("No nationality with ID ${command.nationalityId}")
                }
                passportStatus = command.passportStatus
                passportNumber = command.passportNumber?.takeIf { passportStatus == PassportStatus.PASSPORT }
                passportValidityStartDate =
                    command.passportValidityStartDate?.takeIf { passportStatus == PassportStatus.PASSPORT }
                passportValidityEndDate =
                    command.passportValidityEndDate?.takeIf { passportStatus == PassportStatus.PASSPORT }
                visa = command.visa
                residencePermit = command.residencePermit
                residencePermitDepositDate = command.residencePermitDepositDate
                residencePermitRenewalDate = command.residencePermitRenewalDate
                residencePermitValidityStartDate = command.residencePermitValidityStartDate
                residencePermitValidityEndDate = command.residencePermitValidityEndDate
                handleCouple(this, command.spouseId)
                partner = if (command.spouseId == null) command.partner?.takeIf { it.isNotBlank() } else null
                schoolLevel = command.schoolLevel
            }
        }
    }

    private fun mediationCodeLetter(person: Person): Char {
        val letter = Character.toUpperCase(person.lastName[0])
        return if (letter < 'A' || letter > 'Z') 'Z' else letter
    }

    private fun handleCouple(person: Person, spouseId: Long?) {
        val currentSpouse = person.spouse
        if (currentSpouse != null && currentSpouse.id != spouseId) {
            val couple = person.couple
            currentSpouse.couple = null
            person.couple = null
            coupleDao.delete(couple!!)
        }

        if (spouseId != null && (currentSpouse == null || currentSpouse.id != spouseId)) {
            val newSpouse =
                personDao.findByIdOrNull(spouseId) ?: throw BadRequestException("No person with ID $spouseId")

            val newSpouseCurrentCouple = newSpouse.couple
            if (newSpouseCurrentCouple != null) {
                newSpouse.spouse!!.couple = null
                newSpouse.couple = null
                coupleDao.delete(newSpouseCurrentCouple)
            }
            newSpouse.partner = null

            val newCouple = Couple(person, newSpouse)
            coupleDao.save(newCouple)
        }
    }
}
