package org.globe42.web.persons

import org.globe42.dao.PersonDao
import org.globe42.domain.WeddingEvent
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*
import java.util.stream.Collectors
import javax.transaction.Transactional

/**
 * REST controller used to list and manage the wedding events of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/wedding-events"])
@Transactional
class WeddingEventController(private val personDao: PersonDao) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long): List<WeddingEventDTO> {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        return person.getWeddingEvents()
            .stream()
            .sorted(Comparator.comparing(WeddingEvent::date))
            .map(::WeddingEventDTO)
            .collect(Collectors.toList())
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable("personId") personId: Long,
        @Validated @RequestBody command: WeddingEventCommandDTO
    ): WeddingEventDTO {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)

        val event = WeddingEvent()
        event.date = command.date
        event.type = command.type
        event.location = command.location
        person.addWeddingEvent(event)

        personDao.flush()

        return WeddingEventDTO(event)
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable("personId") personId: Long,
        @PathVariable("eventId") eventId: Long
    ) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        person.getWeddingEvents()
            .stream()
            .filter { p -> p.id == eventId }
            .findAny()
            .ifPresent { person.removeWeddingEvent(it) }
    }
}
