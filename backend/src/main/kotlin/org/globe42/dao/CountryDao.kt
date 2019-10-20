package org.globe42.dao

import org.globe42.domain.Country
import org.springframework.data.jpa.repository.Query

/**
 * DAO for the [Country] entity
 * @author JB Nizet
 */
interface CountryDao : GlobeRepository<Country, String> {
    @Query("select c from Country c order by c.name")
    fun findAllSortedByName(): List<Country>
}
