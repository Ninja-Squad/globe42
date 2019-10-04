package org.globe42.web.persons

import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Membership
import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import javax.transaction.Transactional

/**
 * Controller used to handle memberships
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/memberships"])
@Transactional
class MembershipController(val personDao: PersonDao, val membershipDao: MembershipDao) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long): List<MembershipDTO> {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        return membershipDao.findByPerson(person).map(::MembershipDTO)
    }

    @GetMapping("/current")
    fun getCurrentMembership(@PathVariable("personId") personId: Long): ResponseEntity<MembershipDTO> {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val currentYear = LocalDate.now(PARIS_TIME_ZONE).year
        return membershipDao.findByPersonAndYear(person, currentYear)
            .map { ResponseEntity.ok(MembershipDTO(it)) }
            .orElseGet { ResponseEntity.noContent().build() }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable("personId") personId: Long,
        @Validated @RequestBody command: MembershipCommandDTO
    ): MembershipDTO {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val existing = membershipDao.findByPersonAndYear(person, command.year)
        existing.ifPresent { throw BadRequestException("a membership already exists for this person on this year") }

        val membership = Membership(person, command.year)
        copyCommandToMembership(command, membership)

        membershipDao.save(membership)
        return MembershipDTO(membership)
    }

    /**
     * Updates the given membership. Note that the year may not be changed.
     */
    @PutMapping("/{membershipId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(
        @PathVariable("personId") personId: Long,
        @PathVariable("membershipId") membershipId: Long,
        @Validated @RequestBody command: MembershipCommandDTO
    ) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val membership = membershipDao.findById(membershipId).orElseThrow(::NotFoundException)
        if (membership.person != person) {
            throw NotFoundException()
        }

        copyCommandToMembership(command, membership)
    }

    @DeleteMapping("/{membershipId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable("personId") personId: Long,
        @PathVariable("membershipId") membershipId: Long
    ) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)

        val existing = membershipDao.findById(membershipId)
        existing.ifPresent {
            if (it.person == person) {
                membershipDao.delete(it)
            }
        }
    }

    private fun copyCommandToMembership(command: MembershipCommandDTO, membership: Membership) {
        with(membership) {
            paymentMode = command.paymentMode
            paymentDate = command.paymentDate
            cardNumber = command.cardNumber
        }
    }
}
