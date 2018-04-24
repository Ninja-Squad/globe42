package org.globe42.web.incomes

import java.math.BigDecimal
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

/**
 * Command used to create or update an income source
 * @author JB Nizet
 */
data class IncomeSourceCommandDTO(
        @field:NotEmpty val name: String,
        @field:NotNull val typeId: Long,
        val maxMonthlyAmount: BigDecimal?)
