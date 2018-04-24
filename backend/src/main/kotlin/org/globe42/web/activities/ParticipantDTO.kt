package org.globe42.web.activities

import com.fasterxml.jackson.annotation.JsonUnwrapped
import org.globe42.domain.Person
import org.globe42.web.persons.PersonIdentityDTO

/**
 * Information about a participant to an activity type
 * @author JB Nizet
 */
data class ParticipantDTO(@field:JsonUnwrapped val identity: PersonIdentityDTO,
                          val email: String?,
                          val phoneNumber: String?) {

    constructor(person: Person): this(PersonIdentityDTO(person), person.email, person.phoneNumber)
}
