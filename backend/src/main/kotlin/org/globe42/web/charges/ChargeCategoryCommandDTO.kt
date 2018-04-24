package org.globe42.web.charges

import javax.validation.constraints.NotEmpty

/**
 * Command sent to create or update a charge category
 */
data class ChargeCategoryCommandDTO(@field:NotEmpty val name: String)
