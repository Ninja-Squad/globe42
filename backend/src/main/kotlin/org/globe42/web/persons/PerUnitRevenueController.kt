package org.globe42.web.persons

import org.globe42.dao.PersonDao
import org.globe42.domain.PerUnitRevenueInformation
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * Controller used to get, delete and update the information used for the per-unit revenue computation of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping("/api/persons/{personId}/per-unit-revenue")
@Transactional
class PerUnitRevenueController(val personDao: PersonDao) {
    @GetMapping
    fun get(@PathVariable("personId") personId: Long): ResponseEntity<PerUnitRevenueInformationDTO> {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        return person.perUnitRevenueInformation?.let {
            ResponseEntity.ok(PerUnitRevenueInformationDTO(it))
        } ?: ResponseEntity.noContent().build()
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("personId") personId: Long) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        person.perUnitRevenueInformation = null
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("personId") personId: Long, @RequestBody info: PerUnitRevenueInformationDTO) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        person.perUnitRevenueInformation = PerUnitRevenueInformation(
            info.adultLikeCount,
            info.childCount,
            info.monoParental
        )
    }
}
