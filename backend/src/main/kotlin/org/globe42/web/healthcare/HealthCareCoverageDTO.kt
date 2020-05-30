package org.globe42.web.healthcare

import org.globe42.domain.HealthCareCoverage

/**
 * DTO containing health care coverage entries
 * @author JB Nizet
 */
data class HealthCareCoverageDTO(val entries: List<HealthCareCoverageEntryDTO>)

data class HealthCareCoverageEntryDTO(val coverage: HealthCareCoverage, val count: Long)
