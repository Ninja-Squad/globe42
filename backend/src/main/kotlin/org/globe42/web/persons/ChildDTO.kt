package org.globe42.web.persons

import org.globe42.domain.Child
import org.globe42.domain.Location
import java.time.LocalDate

/**
 * DTO for a [Child]
 * @author JB Nizet
 */
data class ChildDTO(
    val firstName: String?,
    val birthDate: LocalDate?,
    val location: Location
) {
    constructor(child: Child) : this(child.firstName, child.birthDate, child.location)
}
