package org.globe42.web.incomes

import javax.validation.constraints.NotEmpty

/**
 * Command sent to create or update an income source type
 */
data class IncomeSourceTypeCommandDTO(@field:NotEmpty val type: String)
