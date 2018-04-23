package org.globe42.web.incomes

import org.globe42.domain.Income
import java.math.BigDecimal

/**
 * An income of a person
 * @author JB Nizet
 */
data class IncomeDTO(
    val id: Long,
    val source: IncomeSourceDTO,
    val monthlyAmount: BigDecimal
) {

    constructor(income: Income) : this(income.id!!, IncomeSourceDTO(income.source!!), income.monthlyAmount!!)
}
