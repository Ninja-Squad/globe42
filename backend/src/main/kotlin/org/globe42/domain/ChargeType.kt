package org.globe42.domain

import java.math.BigDecimal
import javax.persistence.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

private const val CHARGE_TYPE_GENERATOR = "ChargeTypeGenerator"

/**
 * A type of charge, belonging to a charge category. The same type is shared by many persons, through the [Charge]
 * entity.
 * @author JB Nizet
 */
@Entity
class ChargeType {

    @Id
    @SequenceGenerator(name = CHARGE_TYPE_GENERATOR,
                       sequenceName = "CHARGE_TYPE_SEQ",
                       initialValue = 1000,
                       allocationSize = 1)
    @GeneratedValue(generator = CHARGE_TYPE_GENERATOR)
    var id: Long? = null

    /**
     * The name of the charge type (mortgage, electricity, gas, etc.)
     */
    @NotEmpty
    var name: String? = null

    /**
     * The type of the income source
     */
    @ManyToOne
    @NotNull
    var category: ChargeCategory? = null

    /**
     * The maximum monthly amount (in euros) that the charge can reach. Null if no known maximum.
     */
    var maxMonthlyAmount: BigDecimal? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
