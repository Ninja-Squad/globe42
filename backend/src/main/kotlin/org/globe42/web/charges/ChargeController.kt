package org.globe42.web.charges

import org.globe42.dao.ChargeDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Charge
import org.globe42.domain.Person
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * REST controller used to list, create and delete charges of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/charges"])
@Transactional
class ChargeController(
    private val personDao: PersonDao,
    private val chargeDao: ChargeDao,
    private val chargeTypeDao: ChargeTypeDao
) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long?): List<ChargeDTO> {
        val person = loadPerson(personId)
        return person.getCharges().map(::ChargeDTO)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@PathVariable("personId") personId: Long?, @Validated @RequestBody command: ChargeCommandDTO): ChargeDTO {
        val person = loadPerson(personId)

        val type = chargeTypeDao.findByIdOrNull(command.typeId)
            ?: throw BadRequestException("No charge type with ID ${command.typeId}")

        type.maxMonthlyAmount?.let {
            if (command.monthlyAmount > it) {
                throw BadRequestException("The monthly amount shouldn't be bigger than ${it}")
            }
        }

        val charge = Charge()
        charge.type = type
        charge.monthlyAmount = command.monthlyAmount
        charge.person = person

        return ChargeDTO(chargeDao.save(charge))
    }

    @DeleteMapping("/{chargeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("personId") personId: Long, @PathVariable("chargeId") chargeId: Long) {
        chargeDao.findByIdOrNull(chargeId)?.let { charge ->
            if (charge.person.id != personId) {
                throw NotFoundException("Charge with ID $chargeId does not belong to person $personId")
            }
            chargeDao.delete(charge)
        }
    }

    private fun loadPerson(id: Long?): Person {
        return personDao.findByIdOrNull(id!!) ?: throw NotFoundException("No person with ID $id")
    }
}
