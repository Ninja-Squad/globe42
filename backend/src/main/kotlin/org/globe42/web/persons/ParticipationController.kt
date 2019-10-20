package org.globe42.web.persons

import org.globe42.dao.PersonDao
import org.globe42.domain.Participation
import org.globe42.web.exception.NotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * REST controller used to list and manage the participations to activity types of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/participations"])
@Transactional
class ParticipationController(private val personDao: PersonDao) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long): List<ParticipationDTO> {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        return person.getParticipations().map(::ParticipationDTO)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable("personId") personId: Long,
        @Validated @RequestBody command: ParticipationCommandDTO
    ): ParticipationDTO {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()

        val participation = Participation()
        participation.activityType = command.activityType
        person.addParticipation(participation)

        personDao.flush()

        return ParticipationDTO(participation)
    }

    @DeleteMapping("/{participationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable("personId") personId: Long,
        @PathVariable("participationId") participationId: Long
    ) {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        person.getParticipations()
            .stream()
            .filter { p -> p.id == participationId }
            .findAny()
            .ifPresent { person.removeParticipation(it) }
    }
}
