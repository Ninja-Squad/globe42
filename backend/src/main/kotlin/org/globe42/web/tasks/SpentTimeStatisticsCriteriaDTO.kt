package org.globe42.web.tasks

import org.springframework.format.annotation.DateTimeFormat
import org.springframework.format.annotation.DateTimeFormat.ISO
import java.time.LocalDate

/**
 * Criteria, passed as request parameters, used to get statistics about spent times on tasks
 * @author JB Nizet
 */
data class SpentTimeStatisticsCriteriaDTO(
    val from: LocalDate?,
    val to: LocalDate?
)
