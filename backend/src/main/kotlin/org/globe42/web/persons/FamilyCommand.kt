package org.globe42.web.persons

import org.globe42.domain.Location

/**
 * Command sent to save the family of a person
 * @author JB Nizet
 */
data class FamilyCommand(
    val spouseLocation: Location?,
    val children: Set<ChildDTO>
)
