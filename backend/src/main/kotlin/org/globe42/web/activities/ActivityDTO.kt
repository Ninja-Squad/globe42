package org.globe42.web.activities

import org.globe42.domain.Activity
import org.globe42.domain.ActivityType
import org.globe42.domain.Person
import java.time.LocalDate

/**
 * DTO for an [Activity]
 * @author JB Nizet
 */
data class ActivityDTO(
    val id: Long,
    val type: ActivityType,
    val date: LocalDate,
    val participants: List<ParticipantDTO>
) {
    constructor(activity: Activity) : this(
        activity.id!!,
        activity.type,
        activity.date,
        activity.getParticipants().sortedBy(Person::id).map(::ParticipantDTO)
    )
}
