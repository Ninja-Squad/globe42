package org.globe42.domain

import java.math.BigDecimal
import javax.persistence.*
import javax.validation.constraints.NotNull

private const val CHARGE_GENERATOR = "ChargeGenerator"

/**
 * A finanacial charge that a person has to pay on a monthly basis.
 * @author JB Nizet
 */
@Entity
class Charge {

    @Id
    @SequenceGenerator(name = CHARGE_GENERATOR, sequenceName = "CHARGE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = CHARGE_GENERATOR)
    var id: Long? = null

    /**
     * The person which benefits from this income
     */
    @ManyToOne
    @NotNull
    lateinit var person: Person

    /**
     * The type of the charge
     */
    @ManyToOne
    @NotNull
    lateinit var type: ChargeType

    /**
     * The monthly amount of the charge
     */
    @NotNull
    lateinit var monthlyAmount: BigDecimal

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
