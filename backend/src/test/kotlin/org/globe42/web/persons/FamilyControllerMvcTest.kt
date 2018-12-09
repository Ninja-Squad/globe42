package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.Child
import org.globe42.domain.Family
import org.globe42.domain.Location
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.*

/**
 * MVC tests for [FamilyController]
 * @author JB Nizet
 */
@GlobeMvcTest(FamilyController::class)
class FamilyControllerMvcTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun `should get family of person`() {
        person.family = Family().apply {
            id = 56L
            addChild(Child().apply {
                id = 67
                location = Location.ABROAD
            })
        }

        mvc.perform(get("/api/persons/{personId}/family", person.id!!))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.children[0].location").value(Location.ABROAD.name))
    }

    @Test
    fun `should save family`() {
        val command = FamilyCommand(
            spouseLocation = Location.FRANCE,
            children = emptySet())

        mvc.perform(
            put("/api/persons/{personId}/family", person.id!!)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isNoContent())
        assertThat(person.family).isNotNull()
    }

    @Test
    fun `should delete family`() {
        person.family = Family()

        mvc.perform(delete("/api/persons/{personId}/family", person.id!!))
            .andExpect(status().isNoContent())

        assertThat(person.family).isNull()
    }
}
