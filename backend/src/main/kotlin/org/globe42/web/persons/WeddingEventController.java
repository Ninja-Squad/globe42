package org.globe42.web.persons;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.domain.WeddingEvent;
import org.globe42.web.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to list and manage the wedding events of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/persons/{personId}/wedding-events")
@Transactional
public class WeddingEventController {
    private final PersonDao personDao;

    public WeddingEventController(PersonDao personDao) {
        this.personDao = personDao;
    }

    @GetMapping
    public List<WeddingEventDTO> list(@PathVariable("personId") Long personId) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        return person.getWeddingEvents()
                     .stream()
                     .sorted(Comparator.comparing(WeddingEvent::getDate))
                     .map(WeddingEventDTO::new)
                     .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WeddingEventDTO create(@PathVariable("personId") Long personId,
                                  @Validated @RequestBody WeddingEventCommandDTO command) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);

        WeddingEvent event = new WeddingEvent();
        event.setDate(command.getDate());
        event.setType(command.getType());
        person.addWeddingEvent(event);

        personDao.flush();

        return new WeddingEventDTO(event);
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("personId") Long personId,
                       @PathVariable("eventId") Long eventId) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        person.getWeddingEvents()
              .stream()
              .filter(p -> p.getId().equals(eventId))
              .findAny()
              .ifPresent(person::removeWeddingEvent);
    }
}
