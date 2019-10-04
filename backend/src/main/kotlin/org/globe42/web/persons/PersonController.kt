package org.globe42.web.persons

import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.PersonDao
import org.globe42.domain.City
import org.globe42.domain.Couple
import org.globe42.domain.PassportStatus
import org.globe42.domain.Person
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
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
    private val countryDao: CountryDao
) {

    @GetMapping
    fun list() = personDao.findNotDeleted().map(::PersonIdentityDTO)

    @GetMapping(params = ["deleted"])
    fun listDeleted() = personDao.findDeleted().map(::PersonIdentityDTO)

    @GetMapping("/{personId}")
    fun get(@PathVariable("personId") id: Long): PersonDTO {
        return personDao.findById(id).map(::PersonDTO).orElseThrow { NotFoundException("No person with ID $id") }
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
        val person = personDao.findById(id).orElseThrow { NotFoundException("No person with ID $id") }

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
        val person = personDao.findById(id).orElseThrow { NotFoundException("No person with ID $id") }
        person.deleted = true
    }

    @DeleteMapping("/{personId}/deletion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun resurrect(@PathVariable("personId") id: Long) {
        val person = personDao.findById(id).orElseThrow { NotFoundException("No person with ID $id") }
        person.deleted = false
    }

    @PutMapping("/{personId}/death")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun signalDeath(@PathVariable("personId") id: Long, @Validated @RequestBody command: PersonDeathCommandDTO) {
        val person = personDao.findById(id).orElseThrow { NotFoundException("No person with ID $id") }
        person.deathDate = command.deathDate
        person.clearParticipations()
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
                accompanying = command.accompanying
                socialSecurityNumber = command.socialSecurityNumber
                cafNumber = command.cafNumber
                nationality = command.nationalityId?.let {
                    countryDao.findById(it).orElseThrow {
                        BadRequestException("No nationality with ID ${command.nationalityId}")
                    }
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
                person.partner = if (command.spouseId == null) command.partner?.takeIf { it.isNotBlank() } else null
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
                personDao.findById(spouseId).orElseThrow { BadRequestException("No person with ID $spouseId") }

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
