package org.globe42.web.charges

import org.globe42.domain.Charge
import java.math.BigDecimal

/**
 * A financial charge of a person
 * @author JB Nizet
 */
data class ChargeDTO(val id: Long, val type: ChargeTypeDTO, val monthlyAmount: BigDecimal?) {

    constructor(charge: Charge) : this(charge.id!!, ChargeTypeDTO(charge.type!!), charge.monthlyAmount)
}
