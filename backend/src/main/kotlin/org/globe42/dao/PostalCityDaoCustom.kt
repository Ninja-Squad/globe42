package org.globe42.dao

import org.globe42.domain.PostalCity

/**
 * Custom methods of [PostalCityDao]
 * @author JB Nizet
 */
interface PostalCityDaoCustom {

    /**
     * Inserts all the given cities in an efficient way
     */
    fun saveAllEfficiently(cities: Collection<PostalCity>)

    /**
     * Finds the N first cities whose postal code starts with the given value
     */
    fun findByPostalCode(search: String, limit: Int): List<PostalCity>

    /**
     * Finds the N first cities whose name start with the given value, after sanitization
     */
    fun findByCity(search: String, limit: Int): List<PostalCity>
}
