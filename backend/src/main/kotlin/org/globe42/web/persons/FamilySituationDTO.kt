package org.globe42.web.persons

import org.globe42.domain.FamilySituation

/**
 * The family situation of a person, in France or abroad
 * @author JB Nizet
 */
data class FamilySituationDTO(
    val parentsPresent: Boolean,
    val spousePresent: Boolean,
    val childCount: Int?
) {

    constructor(familySituation: FamilySituation) : this(
        familySituation.parentsPresent,
        familySituation.spousePresent,
        familySituation.childCount
    )
}
