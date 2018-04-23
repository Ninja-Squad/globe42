package org.globe42.web.charges

import java.math.BigDecimal
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

/**
 * Command used to create or update a charge type
 * @author JB Nizet
 */
data class ChargeTypeCommandDTO(
    @field:NotEmpty val name: String,
    @field:NotNull val categoryId: Long,
    val maxMonthlyAmount: BigDecimal?
)
