package org.globe42.web.activities

import org.globe42.dao.ActivityDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Activity
import org.globe42.domain.ActivityType
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.globe42.web.persons.PersonIdentityDTO
import org.globe42.web.util.PageDTO
import org.globe42.web.util.toDTO
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import javax.transaction.Transactional

const val PAGE_SIZE = 20

/**
 * REST controller used to handle the activities
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/activities"])
@Transactional
class ActivityController(private val activityDao: ActivityDao, private val personDao: PersonDao) {

    @GetMapping
    fun list(@RequestParam type: ActivityType?, @RequestParam page: Int?): PageDTO<ActivityDTO> {
        val pageRequest = pageRequest(page)
        val activities: Page<Activity> = type?.let {
            activityDao.pageByType(it, pageRequest)
        } ?: activityDao.pageAll(pageRequest)
        return activities.toDTO(::ActivityDTO)
    }

    @GetMapping("/{activityId}")
    fun get(@PathVariable activityId: Long): ActivityDTO {
        return activityDao.findByIdOrNull(activityId)
            ?.let(::ActivityDTO)
            ?: throw NotFoundException("No activity with ID $activityId")
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Validated @RequestBody command: ActivityCommandDTO): ActivityDTO {
        val activity = Activity()
        copyCommandToActivity(command, activity)
        activityDao.saveAndFlush(activity)
        return ActivityDTO(activity)
    }

    @PutMapping("/{activityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable activityId: Long, @Validated @RequestBody command: ActivityCommandDTO) {
        val activity = activityDao.findByIdOrNull(activityId) ?: throw NotFoundException("No activity with ID $activityId")
        copyCommandToActivity(command, activity)
    }

    @DeleteMapping("/{activityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable activityId: Long) {
        val activity = activityDao.findByIdOrNull(activityId) ?: throw NotFoundException("No activity with ID $activityId")
        activityDao.delete(activity)
    }

    @GetMapping("/reports")
    fun report(@RequestParam type: ActivityType, @RequestParam from: LocalDate, @RequestParam to: LocalDate): ActivityReportDTO {
        val totalActivityCount = activityDao.countWithTypeBetwen(type, from, to)
        val presences = activityDao.countPresencesWithTypeBetween(type, from, to)

        val persons = personDao.findAllById(presences.map { it.personId }).associateBy { it.id }

        return ActivityReportDTO(
            totalActivityCount,
            presences.map { p -> PresenceDTO(PersonIdentityDTO(persons[p.personId]!!), p.count) }
        )
    }

    private fun copyCommandToActivity(command: ActivityCommandDTO, activity: Activity) {
        activity.apply {
            type = command.type
            date = command.date
            setParticipants(command.participantIds.map { id ->
                personDao.findByIdOrNull(id) ?: throw BadRequestException("no person with ID $id")
            })
        }
    }

    private fun pageRequest(page: Int?): PageRequest {
        return PageRequest.of(page ?: 0, PAGE_SIZE)
    }
}
