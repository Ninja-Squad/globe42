package org.globe42.web.incomes

import org.globe42.domain.IncomeSource
import java.math.BigDecimal

/**
 * DTO of an income source
 * @see org.globe42.domain.IncomeSource
 *
 * @author JB Nizet
 */
data class IncomeSourceDTO(
    val id: Long,
    val name: String,
    val type: IncomeSourceTypeDTO,
    val maxMonthlyAmount: BigDecimal?
) {

    constructor(incomeSource: IncomeSource) : this(
        incomeSource.id!!,
        incomeSource.name,
        IncomeSourceTypeDTO(incomeSource.type),
        incomeSource.maxMonthlyAmount
    )
}
