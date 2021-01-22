package org.globe42.web.activities

import org.globe42.dao.Presence
import org.globe42.web.persons.PersonIdentityDTO

/**
 * A report for an activity type
 * @author JB Nizet
 */
data class ActivityReportDTO(
    val totalActivityCount: Long,
    val presences: List<PresenceDTO>
)

data class PresenceDTO(
    val person: PersonIdentityDTO,
    val activityCount: Long
)
