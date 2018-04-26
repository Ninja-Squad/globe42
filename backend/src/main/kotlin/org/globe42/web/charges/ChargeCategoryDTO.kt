package org.globe42.web.charges

import org.globe42.domain.ChargeCategory
import org.globe42.domain.IncomeSourceType

/**
 * DTO for a charge category
 * @see IncomeSourceType
 *
 * @author JB Nizet
 */
data class ChargeCategoryDTO(val id: Long, val name: String) {
    constructor(category: ChargeCategory) : this(category.id!!, category.name)
}
