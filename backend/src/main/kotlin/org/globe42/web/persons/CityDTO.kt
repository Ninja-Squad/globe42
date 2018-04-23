package org.globe42.web.persons

import org.globe42.domain.City
import org.globe42.domain.PostalCity
import org.hibernate.validator.constraints.Length

/**
 * DTO for a city
 * @author JB Nizet
 */
data class CityDTO(
    @field:Length(min = 5, max = 5) val code: String,
    val city: String
) {
    constructor(city: City) : this(city.code, city.city)
    constructor(city: PostalCity) : this(city.postalCode!!, city.city!!)
}
