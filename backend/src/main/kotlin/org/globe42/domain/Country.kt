package org.globe42.domain

import javax.persistence.Entity
import javax.persistence.Id

/**
 * A country (used to serve as a nationality, in fact), identified by an ISO 3166-1 alpha-3 country code`
 * See https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
 * @author JB Nizet
 */
@Entity
class Country(

    /**
     * The ISO code of the country
     */
    @Id
    var id: String,

    /**
     * The French name of the country
     */
    var name: String
)
