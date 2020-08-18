package org.globe42.domain

import java.math.BigDecimal
import javax.persistence.*
import javax.validation.constraints.NotNull

private const val INCOME_GENERATOR = "IncomeGenerator"

/**
 * An income that a person has, provided by an income source.
 * @author JB Nizet
 */
@Entity
class Income {

    @Id
    @SequenceGenerator(
        name = INCOME_GENERATOR,
        sequenceName = "INCOME_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = INCOME_GENERATOR)
    var id: Long? = null

    /**
     * The person which benefits from this income
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    lateinit var person: Person

    /**
     * The source of the income
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    lateinit var source: IncomeSource

    /**
     * The monthly amount of the income
     */
    @NotNull
    lateinit var monthlyAmount: BigDecimal

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
