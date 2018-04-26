package org.globe42.domain

import org.hibernate.validator.constraints.Length
import javax.persistence.Column
import javax.persistence.Embeddable

/**
 * A city, with its postal code
 * @author JB Nizet
 */
@Embeddable
class City {
    @field:Length(min = 5, max = 5) @field:Column(name = "postal_code") lateinit var code: String
        private set

    lateinit var city: String
        private set

    constructor()

    constructor(code: String, city: String) {
        this.code = code
        this.city = city
    }
}

