package org.globe42.domain

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.SequenceGenerator
import javax.validation.constraints.NotEmpty

private const val POSTAL_CITY_GENERATOR = "PostalCityGenerator"

/**
 * A city, imported from the official postal code reference at
 * [Data Gouv](https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/).
 * @author JB Nizet
 */
@Entity
class PostalCity {

    @Id
    @SequenceGenerator(
        name = POSTAL_CITY_GENERATOR,
        sequenceName = "POSTAL_CITY_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = POSTAL_CITY_GENERATOR)
    var id: Long? = null

    @NotEmpty
    var postalCode: String? = null

    /**
     * The city, which is supposed to be in uppercase
     */
    @NotEmpty
    var city: String? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(postalCode: String, city: String) {
        this.postalCode = postalCode
        this.city = city
    }
}
