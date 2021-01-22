package org.globe42.dao

import org.globe42.domain.Activity
import org.globe42.domain.ActivityType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

/**
 * DAO for the [Activity] entity
 * @author JB Nizet
 */
interface ActivityDao : GlobeRepository<Activity, Long> {

    @Query("select a from Activity a order by a.date desc")
    fun pageAll(page: Pageable): Page<Activity>

    @Query("select a from Activity a where a.type = :type order by a.date desc")
    fun pageByType(@Param("type") type: ActivityType, page: Pageable): Page<Activity>
}
