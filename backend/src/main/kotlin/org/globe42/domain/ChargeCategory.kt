package org.globe42.domain

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.SequenceGenerator
import javax.validation.constraints.NotEmpty

private const val CHARGE_CATEGORY_GENERATOR = "ChargeCategoryGenerator"

/**
 * A category of charges like, for example, "house rental charge". Charge types (like "mortgage", or "electricity")
 * belong to a single charge category. And actual charges of a person have a charge type.
 * This is kind of like an enum, except we don't want to change, build and deploy the
 * application if we discover that there's a missing category.
 * @author JB Nizet
 */
@Entity
class ChargeCategory {

    @Id
    @SequenceGenerator(name = CHARGE_CATEGORY_GENERATOR,
                       sequenceName = "CHARGE_CATEGORY_SEQ",
                       initialValue = 1000,
                       allocationSize = 1)
    @GeneratedValue(generator = CHARGE_CATEGORY_GENERATOR)
    var id: Long? = null

    /**
     * The name of the category, as displayed in the application
     */
    @NotEmpty
    var name: String? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(id: Long, name: String) {
        this.id = id
        this.name = name
    }
}
