package org.globe42.web.charges

import java.math.BigDecimal
import javax.validation.constraints.NotNull

/**
 * A command used to create a charge for a person
 * @author JB Nizet
 */
data class ChargeCommandDTO (
        /**
         * The ID of the source of the charge
         */
        @field:NotNull
        val typeId: Long,

        /**
         * The monthly amount of the charge
         */
        @field:NotNull
        val monthlyAmount: BigDecimal)
