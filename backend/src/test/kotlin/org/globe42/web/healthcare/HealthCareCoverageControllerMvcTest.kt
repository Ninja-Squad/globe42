package org.globe42.web.healthcare

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.HealthCareCoverageEntry
import org.globe42.dao.PersonDao
import org.globe42.domain.HealthCareCoverage
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

/**
 * MVC tests for [HealthCareCoverageController]
 * @author JB Nizet
 */
@GlobeMvcTest(HealthCareCoverageController::class)
class HealthCareCoverageControllerMvcTest(@Autowired val mockMvc: MockMvc) {

    @MockkBean
    lateinit var personDao: PersonDao

    @Test
    fun `should get health care coverage`() {
        every { personDao.findHealthCareCoverage() } returns listOf(
            HealthCareCoverageEntry(HealthCareCoverage.NONE, 12L),
            HealthCareCoverageEntry(HealthCareCoverage.AGR, 2)
        )

        mockMvc.get("/api/health-care-coverage").andExpect {
            status { isOk() }
            jsonValue("$.entries.length()", HealthCareCoverage.values().size)
            jsonValue("$.entries[0].coverage", HealthCareCoverage.values()[0].name) // UNKNOWN
            jsonValue("$.entries[0].count", 0)
            jsonValue("$.entries[1].coverage", HealthCareCoverage.values()[1].name) // NONE
            jsonValue("$.entries[1].count", 12L)
        }
    }
}
