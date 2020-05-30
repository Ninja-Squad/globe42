package org.globe42.web.healthcare

import org.globe42.dao.HealthCareCoverageEntry
import org.globe42.dao.PersonDao
import org.globe42.domain.HealthCareCoverage
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.transaction.Transactional

/**
 * Controller used to get health care coverage statistics
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/health-care-coverage"])
@Transactional
class HealthCareCoverageController(private val personDao: PersonDao) {
    @GetMapping
    fun get(): HealthCareCoverageDTO {
        val entries =
            personDao.findHealthCareCoverage().associateBy(HealthCareCoverageEntry::coverage, HealthCareCoverageEntry::count)
        return HealthCareCoverageDTO(
            HealthCareCoverage.values().map { HealthCareCoverageEntryDTO(it, entries[it] ?: 0) }
        )
    }
}
