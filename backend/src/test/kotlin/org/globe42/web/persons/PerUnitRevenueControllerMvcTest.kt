package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.PersonDao
import org.globe42.domain.Gender
import org.globe42.domain.PerUnitRevenueInformation
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.put
import java.util.*

/**
 * MVC tests for [PerUnitRevenueController]
 * @author JB Nizet
 */
@GlobeMvcTest(PerUnitRevenueController::class)
class PerUnitRevenueControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {

    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    @Test
    fun `should return information if present`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        person.perUnitRevenueInformation = PerUnitRevenueInformation(2, 3, true)
        every { mockPersonDao.findById(42L) } returns Optional.of(person)

        mvc.get("/api/persons/{personId}/per-unit-revenue", person.id!!).andExpect {
            status { isOk }
            jsonValue("$.adultLikeCount", 2)
        }
    }

    @Test
    fun `should return null if absent`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        every { mockPersonDao.findById(42L) } returns Optional.of(person)

        mvc.get("/api/persons/{personId}/per-unit-revenue", person.id!!).andExpect {
            status { isNoContent }
            content { string("") }
        }
    }

    @Test
    fun `should reset to null when deleting`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        every { mockPersonDao.findById(42L) } returns Optional.of(person)

        mvc.delete("/api/persons/{personId}/per-unit-revenue", person.id!!).andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should update`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        every { mockPersonDao.findById(42L) } returns Optional.of(person)

        mvc.put("/api/persons/{personId}/per-unit-revenue", person.id!!) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(PerUnitRevenueInformationDTO(2, 3, true))
        }.andExpect {
            status { isNoContent }
        }
    }
}
