package org.globe42.domain

import java.math.BigDecimal
import javax.persistence.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

private const val INCOME_SOURCE_GENERATOR = "IncomeSourceGenerator"

/**
 * A source of income. The same source is shared by many persons, through the [Income] entity.
 * @author JB Nizet
 */
@Entity
class IncomeSource {

    @Id
    @SequenceGenerator(
        name = INCOME_SOURCE_GENERATOR,
        sequenceName = "INCOME_SOURCE_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = INCOME_SOURCE_GENERATOR)
    var id: Long? = null

    /**
     * The name of the source of income (APL, Agirc/Arrco, etc.)
     */
    @NotEmpty
    var name: String? = null

    /**
     * The type of the income source
     */
    @ManyToOne
    @NotNull
    var type: IncomeSourceType? = null

    /**
     * The maximum monthly amount (in euros) that the income source can give as income. Null if no known maximum.
     */
    var maxMonthlyAmount: BigDecimal? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
