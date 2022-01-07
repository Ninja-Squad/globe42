package org.globe42.web.persons

import org.globe42.dao.PersonDao
import org.globe42.domain.Family
import org.globe42.domain.Relative
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import javax.transaction.Transactional

/**
 * Controller used to create, read, update and delete the family of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/family"])
@Transactional
class FamilyController(val personDao: PersonDao) {

    @GetMapping
    fun get(@PathVariable("personId") personId: Long): ResponseEntity<FamilyDTO> {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        return person.family?.let { ResponseEntity.ok(FamilyDTO(it)) } ?: ResponseEntity.noContent().build()
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun save(@PathVariable("personId") personId: Long, @RequestBody @Validated command: FamilyCommand) {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        val family = Family()
        with(family) {
            spouseLocation = command.spouseLocation
            command.relatives.forEach { relativeCommand ->
                addRelative(Relative().apply {
                    type = relativeCommand.type
                    firstName = relativeCommand.firstName
                    birthDate = relativeCommand.birthDate
                    location = relativeCommand.location
                })
            }
        }
        person.family = family
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("personId") personId: Long) {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        person.family = null
    }
}
