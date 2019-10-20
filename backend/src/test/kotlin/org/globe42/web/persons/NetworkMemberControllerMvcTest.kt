package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.PersonDao
import org.globe42.domain.NetworkMember
import org.globe42.domain.NetworkMemberType
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.*
import java.util.*

/**
 * MVC tests for [NetworkMemberController]
 * @author JB Nizet
 */
@GlobeMvcTest(NetworkMemberController::class)
class NetworkMemberControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        person.addNetworkMember(NetworkMember(NetworkMemberType.DOCTOR, "Dr. No").apply { id = 345L })
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
    }

    @Test
    fun `should list`() {
        mvc.get("/api/persons/{personId}/network-members", person.id).andExpect {
            status { isOk }
            jsonValue("$[0].id", 345L)
            jsonValue("$[0].type", NetworkMemberType.DOCTOR.name)
            jsonValue("$[0].text", "Dr. No")
        }
    }

    @Test
    fun `should create`() {
        val command = NetworkMemberCommandDTO(NetworkMemberType.LAWYER, "Dr. Yes")
        every { mockPersonDao.flush() } answers {
            person.getNetworkMembers().find { it.type == command.type }?.let { it.id = 876 }
            Unit
        }

        mvc.post("/api/persons/{personId}/network-members", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
        }
    }

    @Test
    fun `should update`() {
        val command = NetworkMemberCommandDTO(NetworkMemberType.LAWYER, "Dr. Yes")

        mvc.put("/api/persons/{personId}/network-members/{memberId}", person.id, 345L) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should delete`() {
        mvc.delete("/api/persons/{personId}/network-members/{memberId}", person.id, 345L).andExpect {
            status { isNoContent }
        }
    }
}
