package org.globe42.web.activities

import org.globe42.dao.PersonDao
import org.globe42.domain.ActivityType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.transaction.Transactional

/**
 * REST controller used to list the persons participating in a given actiity type
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/activity-types/{activityType}/participants"])
@Transactional
class ActivityTypeController(private val personDao: PersonDao) {

    @GetMapping
    fun list(@PathVariable("activityType") activityType: ActivityType): List<ParticipantDTO> {
        return personDao.findParticipants(activityType).map(::ParticipantDTO)
    }
}
