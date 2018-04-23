package org.globe42.web.incomes

import java.math.BigDecimal
import javax.validation.constraints.NotNull

/**
 * A command used to create an income for a person
 * @author JB Nizet
 */
data class IncomeCommandDTO(

    /**
     * The ID of the source of the income
     */
    @field:NotNull val sourceId: Long,

    /**
     * The monthly amount of the income
     */
    @field:NotNull val monthlyAmount: BigDecimal
)
