package org.globe42.web.persons

import org.globe42.domain.ActivityType
import org.globe42.domain.Participation

/**
 * The participation of a person to an activity type
 * @author JB Nizet
 */
data class ParticipationDTO(
        val id: Long,
        val activityType: ActivityType) {

    constructor(participation: Participation) : this(participation.id!!, participation.activityType!!)
}
