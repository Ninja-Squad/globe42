package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.domain.NetworkMember
import org.globe42.domain.NetworkMemberType
import org.globe42.domain.Person
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.Test
import java.util.*

/**
 * Unit tests for [NetworkMemberController]
 * @author JB Nizet
 */
class NetworkMemberControllerTest {
    private val mockPersonDao = mockk<PersonDao>()

    private val controller = NetworkMemberController(mockPersonDao)

    private val person = Person(42L)

    @Test
    fun `should list network members of a person`() {
        val member = NetworkMember(NetworkMemberType.DOCTOR, "Dr. No").apply { id = 34L }
        person.addNetworkMember(member)
        val personId = person.id!!
        every { mockPersonDao.findById(personId) } returns Optional.of(person)

        val result = controller.list(personId)

        assertThat(result).hasSize(1)
        assertThat(result.first()).isEqualTo(NetworkMemberDTO(member.id!!, member.type, member.text))
    }

    @Test
    fun `should throw if person doesn't exist`() {
        val personId = 2L
        every { mockPersonDao.findById(personId) } returns Optional.empty()

        Assertions.assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.list(personId)
        }
    }

    @Test
    fun `should create a network member for a person`() {
        val personId = person.id!!
        every { mockPersonDao.findById(personId) } returns Optional.of(person)
        val command = NetworkMemberCommandDTO(NetworkMemberType.DOCTOR, "Dr. No")

        every { mockPersonDao.flush() } answers {
            person.getNetworkMembers().find { it.type == command.type }?.let { it.id = 876 }
            Unit
        }

        val result = controller.create(personId, command)

        assertThat(person.getNetworkMembers()).hasSize(1)
        with(person.getNetworkMembers().first()) {
            assertMemberEqualsCommand(this, command)
            assertThat(person).isEqualTo(person)
        }
        assertThat(result.id).isEqualTo(876)
    }

    @Test
    fun `should update a network member of a person`() {
        val member = NetworkMember(NetworkMemberType.DOCTOR, "Dr. No").apply { id = 34L }
        person.addNetworkMember(member)
        val personId = person.id!!
        every { mockPersonDao.findById(personId) } returns Optional.of(person)

        val command = NetworkMemberCommandDTO(NetworkMemberType.LAWYER, "Dr Yes")
        controller.update(person.id!!, member.id!!, command)

        assertMemberEqualsCommand(member, command)
    }

    @Test
    fun `should throw when updating a member that doesn't exist`() {
        val personId = person.id!!
        every { mockPersonDao.findById(personId) } returns Optional.of(person)

        val command = NetworkMemberCommandDTO(NetworkMemberType.LAWYER, "Dr Yes")
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, 5678L, command)
        }
    }

    @Test
    fun `should delete a member of a person`() {
        val member = NetworkMember(NetworkMemberType.DOCTOR, "Dr. No").apply { id = 34L }
        person.addNetworkMember(member)
        val personId = person.id!!
        every { mockPersonDao.findById(personId) } returns Optional.of(person)

        controller.delete(personId, member.id!!)

        assertThat(person.getNetworkMembers()).isEmpty()
    }

    @Test
    fun `should throw when deleting a member of a person that doesn't exist`() {
        val personId = 2L
        every { mockPersonDao.findById(personId) } returns Optional.empty()

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.delete(personId, 5678L)
        }
    }

    @Test
    fun `should not throw when deleting a member that doesn't exist`() {
        val personId = person.id!!
        every { mockPersonDao.findById(personId) } returns Optional.of(person)

        controller.delete(personId, 5678L)
    }

    fun assertMemberEqualsCommand(member: NetworkMember, command: NetworkMemberCommandDTO) {
        with(member) {
            assertThat(type).isEqualTo(command.type)
            assertThat(text).isEqualTo(command.text)
        }
    }
}
