package org.globe42.web.charges

import org.globe42.domain.ChargeType
import java.math.BigDecimal

/**
 * DTO of a charge type
 * @see ChargeType
 *
 * @author JB Nizet
 */
data class ChargeTypeDTO(
        val id: Long,
        val name: String,
        val category: ChargeCategoryDTO,
        val maxMonthlyAmount: BigDecimal?) {

    constructor(chargeType: ChargeType) : this(chargeType.id!!,
                                               chargeType.name!!,
                                               ChargeCategoryDTO(chargeType.category!!),
                                               chargeType.maxMonthlyAmount)
}
