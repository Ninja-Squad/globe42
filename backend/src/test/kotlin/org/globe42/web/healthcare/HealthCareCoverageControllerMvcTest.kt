package org.globe42.web.healthcare

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.HealthCareCoverageEntry
import org.globe42.dao.PersonDao
import org.globe42.domain.HealthCareCoverage
import org.globe42.test.GlobeMvcTest
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
            status { isOk }
            jsonPath("$.entries.length()") { value(HealthCareCoverage.values().size) }
            jsonPath("$.entries[0].coverage") { value(HealthCareCoverage.values()[0].name) } // UNKNOWN
            jsonPath("$.entries[0].count") { value(0) }
            jsonPath("$.entries[1].coverage") { value(HealthCareCoverage.values()[1].name) } // NONE
            jsonPath("$.entries[1].count") { value(12L) }
        }
    }
}
