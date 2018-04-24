package org.globe42.web.persons

import org.globe42.domain.WeddingEventType
import java.time.LocalDate

/**
 * Command sent to create a wedding event
 * @author JB Nizet
 */
data class WeddingEventCommandDTO(val date: LocalDate, val type: WeddingEventType)
