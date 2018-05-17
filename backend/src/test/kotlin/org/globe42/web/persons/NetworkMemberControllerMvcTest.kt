package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.NetworkMember
import org.globe42.domain.NetworkMemberType
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
 * MVC tests for [NetworkMemberController]
 * @author JB Nizet
 */
@GlobeMvcTest(NetworkMemberController::class)
class NetworkMemberControllerMvcTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var mvc: MockMvc

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        person.addNetworkMember(NetworkMember(NetworkMemberType.DOCTOR, "Dr. No").apply { id = 345L })
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun `should list`() {
        mvc.perform(get("/api/persons/{personId}/network-members", person.id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(345L))
            .andExpect(jsonPath("$[0].type").value(NetworkMemberType.DOCTOR.name))
            .andExpect(jsonPath("$[0].text").value("Dr. No"))
    }

    @Test
    fun `should create`() {
        val command = NetworkMemberCommandDTO(NetworkMemberType.LAWYER, "Dr. Yes")
        whenever(mockPersonDao.flush()).then {
            person.getNetworkMembers().find { it.type == command.type }?.let { it.id = 876 }
            Unit
        }

        mvc.perform(
            post("/api/persons/{personId}/network-members", person.id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isCreated())
    }

    @Test
    fun `should update`() {
        val command = NetworkMemberCommandDTO(NetworkMemberType.LAWYER, "Dr. Yes")

        mvc.perform(
            put("/api/persons/{personId}/network-members/{memberId}", person.id, 345L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isNoContent())
    }

    @Test
    fun `should delete`() {
        mvc.perform(delete("/api/persons/{personId}/network-members/{memberId}", person.id, 345L))
            .andExpect(status().isNoContent())
    }
}
