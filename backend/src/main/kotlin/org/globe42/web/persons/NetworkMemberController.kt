package org.globe42.web.persons

import org.globe42.dao.PersonDao
import org.globe42.domain.NetworkMember
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*
import java.util.stream.Collectors
import javax.transaction.Transactional

/**
 * REST controller used to list and manage the network members of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/network-members"])
@Transactional
class NetworkMemberController(private val personDao: PersonDao) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long): List<NetworkMemberDTO> {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        return person.getNetworkMembers()
            .stream()
            .sorted(Comparator.comparing(NetworkMember::type))
            .map(::NetworkMemberDTO)
            .collect(Collectors.toList())
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable("personId") personId: Long,
        @Validated @RequestBody command: NetworkMemberCommandDTO
    ): NetworkMemberDTO {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)

        val member = NetworkMember()
        copyCommandToMember(command, member)
        person.addNetworkMember(member)

        personDao.flush()

        return NetworkMemberDTO(member)
    }

    @PutMapping("/{networkMemberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(
        @PathVariable("personId") personId: Long,
        @PathVariable("networkMemberId") networkMemberId: Long,
        @Validated @RequestBody command: NetworkMemberCommandDTO
    ) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val member = person.getNetworkMembers()
            .stream()
            .filter { p -> p.id == networkMemberId }
            .findAny()
            .orElseThrow(::NotFoundException)

        copyCommandToMember(command, member)
    }

    @DeleteMapping("/{networkMemberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable("personId") personId: Long,
        @PathVariable("networkMemberId") networkMemberId: Long
    ) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        person.getNetworkMembers()
            .stream()
            .filter { p -> p.id == networkMemberId }
            .findAny()
            .ifPresent { person.removeNetworkMember(it) }
    }

    private fun copyCommandToMember(command: NetworkMemberCommandDTO, member: NetworkMember) {
        with(member) {
            type = command.type
            text = command.text
        }
    }
}
