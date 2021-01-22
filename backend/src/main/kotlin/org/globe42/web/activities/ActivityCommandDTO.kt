package org.globe42.web.activities

import org.globe42.domain.ActivityType
import java.time.LocalDate

data class ActivityCommandDTO(
    val type: ActivityType,
    val date: LocalDate,
    val participantIds: Set<Long>
)
