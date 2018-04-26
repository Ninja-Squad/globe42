package org.globe42.domain

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.SequenceGenerator
import javax.validation.constraints.NotEmpty

private const val INCOME_SOURCE_TYPE_GENERATOR = "IncomeSourceTypeGenerator"

/**
 * A type of income source. This is kind of like an enum, except we don't want to change, build and deploy the
 * application if we discover that there's a missing type.
 * @author JB Nizet
 */
@Entity
class IncomeSourceType {

    @Id
    @SequenceGenerator(
        name = INCOME_SOURCE_TYPE_GENERATOR,
        sequenceName = "INCOME_SOURCE_TYPE_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = INCOME_SOURCE_TYPE_GENERATOR)
    var id: Long? = null

    /**
     * The type, as displayed in the application
     */
    @NotEmpty
    lateinit var type: String

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(id: Long, type: String) {
        this.id = id
        this.type = type
    }
}
