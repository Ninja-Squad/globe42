package org.globe42.web.persons;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Participation;
import org.globe42.domain.Person;
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
 * REST controller used to list and manage the participations to activity types of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/persons/{personId}/participations")
@Transactional
public class ParticipationController {
    private final PersonDao personDao;

    public ParticipationController(PersonDao personDao) {
        this.personDao = personDao;
    }

    @GetMapping
    public List<ParticipationDTO> list(@PathVariable("personId") Long personId) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        return person.getParticipations()
                     .stream()
                     .map(ParticipationDTO::new)
                     .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ParticipationDTO create(@PathVariable("personId") Long personId, @Validated @RequestBody ParticipationCommandDTO command) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);

        Participation participation = new Participation();
        participation.setActivityType(command.getActivityType());
        person.addParticipation(participation);

        personDao.flush();

        return new ParticipationDTO(participation);
    }

    @DeleteMapping("/{participationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("personId") Long personId,
                       @PathVariable("participationId") Long participationId) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        person.getParticipations()
              .stream()
              .filter(p -> p.getId().equals(participationId))
              .findAny()
              .ifPresent(person::removeParticipation);
    }
}
