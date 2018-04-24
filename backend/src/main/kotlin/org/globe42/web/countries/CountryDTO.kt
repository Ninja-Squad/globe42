package org.globe42.web.countries

import org.globe42.domain.Country

/**
 * A DTO for the [Country] entity
 * @author JB Nizet
 */
data class CountryDTO(val id: String, val name: String) {
    constructor(country: Country): this(country.id, country.name)
}
