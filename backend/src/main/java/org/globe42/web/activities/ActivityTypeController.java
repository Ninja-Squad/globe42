package org.globe42.web.activities;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.ActivityType;
import org.globe42.web.persons.PersonIdentityDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to list the persons participating in a given actiity type
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/activity-types/{activityType}/participants")
@Transactional
public class ActivityTypeController {

    private final PersonDao personDao;

    public ActivityTypeController(PersonDao personDao) {
        this.personDao = personDao;
    }

    @GetMapping
    public List<ParticipantDTO> list(@PathVariable("activityType") ActivityType activityType) {
        return personDao.findParticipants(activityType)
            .stream()
            .map(ParticipantDTO::new)
            .collect(Collectors.toList());
    }
}
