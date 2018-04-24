package org.globe42.web.persons

import org.globe42.domain.ActivityType

/**
 * Command used to create new participation
 * @author JB Nizet
 */
data class ParticipationCommandDTO(val activityType: ActivityType)
