package org.globe42.web.persons

import org.globe42.domain.WeddingEvent
import org.globe42.domain.WeddingEventType
import java.time.LocalDate

/**
 * DTO for [org.globe42.domain.WeddingEvent]
 * @author JB Nizet
 */
data class WeddingEventDTO(
        val id: Long,
        val date: LocalDate,
        val type: WeddingEventType) {

    constructor(event: WeddingEvent) : this(
            event.id!!,
            event.date!!,
            event.type!!)
}
