package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.Gender
import org.globe42.domain.PerUnitRevenueInformation
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.util.*

/**
 * MVC tests for [PerUnitRevenueController]
 * @author JB Nizet
 */
@GlobeMvcTest(PerUnitRevenueController::class)
class PerUnitRevenueControllerMvcTest {

    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `should return information if present`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        person.perUnitRevenueInformation = PerUnitRevenueInformation(2, 3, true)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        mvc.perform(get("/api/persons/{personId}/per-unit-revenue", person.id!!))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.adultLikeCount").value(2))
    }

    @Test
    fun `should return null if absent`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        mvc.perform(get("/api/persons/{personId}/per-unit-revenue", person.id!!))
            .andExpect(status().isNoContent())
            .andExpect(content().string(""))
    }

    @Test
    fun `should reset to null when deleting`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        mvc.perform(delete("/api/persons/{personId}/per-unit-revenue", person.id!!))
            .andExpect(status().isNoContent())
    }

    @Test
    fun `should update`() {
        val person = Person(42L, "John", "Doe", Gender.MALE)
        whenever(mockPersonDao.findById(42L)).thenReturn(Optional.of(person))

        mvc.perform(delete("/api/persons/{personId}/per-unit-revenue", person.id!!)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(PerUnitRevenueInformationDTO(2, 3, true))))
            .andExpect(status().isNoContent())
    }
}
