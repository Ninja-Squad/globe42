package org.globe42.web.persons

import org.globe42.domain.Person

/**
 * A DTO allowing to identify a person. Used in person list.
 * @author JB Nizet
 */
data class PersonIdentityDTO(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val nickName: String?,
    val mediationCode: String?,
    val phoneNumber: String?,
    val email: String?
) {

    constructor(person: Person) : this(
        id = person.id!!,
        firstName = person.firstName,
        lastName = person.lastName,
        nickName = person.nickName,
        // we hide the mediation code if mediation is disabled
        mediationCode = if (person.mediationEnabled) person.mediationCode else null,
        phoneNumber = person.phoneNumber,
        email = person.email
    )
}
