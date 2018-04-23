package org.globe42.domain

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.SequenceGenerator

const val FAMILY_SITUATION_GENERATOR = "FamilySituationGenerator"

/**
 * The family situation of a person (in France, or abroad)
 * @author JB Nizet
 */
@Entity
class FamilySituation {

    @Id
    @SequenceGenerator(
        name = FAMILY_SITUATION_GENERATOR,
        sequenceName = "FAMILY_SITUATION_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = FAMILY_SITUATION_GENERATOR)
    var id: Long? = null

    var parentsPresent: Boolean = false
    var spousePresent: Boolean = false
    var childCount: Int? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(
        parentsPresent: Boolean,
        spousePresent: Boolean,
        childCount: Int?
    ) {
        this.parentsPresent = parentsPresent
        this.spousePresent = spousePresent
        this.childCount = childCount
    }
}
