package org.globe42.web.incomes

import org.globe42.domain.IncomeSourceType

/**
 * DTO for an income source type
 * @see IncomeSourceType
 *
 * @author JB Nizet
 */
data class IncomeSourceTypeDTO(
        val id: Long,
        val type: String) {

    constructor(incomeSourceType: IncomeSourceType): this(
            incomeSourceType.id!!,
            incomeSourceType.type!!)
}
