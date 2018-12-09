package org.globe42.web.persons

import org.globe42.domain.Family
import org.globe42.domain.Location

/**
 * DTO for a [Family]
 * @author JB Nizet
 */
data class FamilyDTO(
    val spouseLocation: Location?,
    val children: List<ChildDTO>
) {
    constructor(family: Family) : this(
        family.spouseLocation,
        family.getChildren().map(::ChildDTO)
    )
}
