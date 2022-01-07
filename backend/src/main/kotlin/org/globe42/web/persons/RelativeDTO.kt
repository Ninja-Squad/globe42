package org.globe42.web.persons

import org.globe42.domain.Location
import org.globe42.domain.Relative
import org.globe42.domain.RelativeType
import java.time.LocalDate

/**
 * DTO for a [Relative]
 * @author JB Nizet
 */
data class RelativeDTO(
    val type: RelativeType,
    val firstName: String?,
    val birthDate: LocalDate?,
    val location: Location
) {
    constructor(relative: Relative) : this(relative.type, relative.firstName, relative.birthDate, relative.location)
}
