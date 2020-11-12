package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.Child
import org.globe42.domain.Family
import org.globe42.domain.Location
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.put

/**
 * MVC tests for [FamilyController]
 * @author JB Nizet
 */
@GlobeMvcTest(FamilyController::class)
class FamilyControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
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

        mvc.get("/api/persons/{personId}/family", person.id!!).andExpect {
            status { isOk() }
            jsonValue("$.children[0].location", Location.ABROAD.name)
        }
    }

    @Test
    fun `should save family`() {
        val command = FamilyCommand(
            spouseLocation = Location.FRANCE,
            children = emptySet()
        )

        mvc.put("/api/persons/{personId}/family", person.id!!) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent() }
        }

        assertThat(person.family).isNotNull
    }

    @Test
    fun `should delete family`() {
        person.family = Family()

        mvc.delete("/api/persons/{personId}/family", person.id!!).andExpect {
            status { isNoContent() }
        }

        assertThat(person.family).isNull()
    }
}
