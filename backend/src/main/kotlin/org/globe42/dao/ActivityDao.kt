package org.globe42.dao

import org.globe42.domain.Activity
import org.globe42.domain.ActivityType
import org.globe42.domain.Person
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDate

/**
 * DAO for the [Activity] entity
 * @author JB Nizet
 */
interface ActivityDao : GlobeRepository<Activity, Long> {

    @Query("select a from Activity a order by a.date desc")
    fun pageAll(page: Pageable): Page<Activity>

    @Query("select a from Activity a where a.type = :type order by a.date desc")
    fun pageByType(@Param("type") type: ActivityType, page: Pageable): Page<Activity>

    @Query("select count(a.id) from Activity a where a.type = :type and a.date between :from and :to")
    fun countWithTypeBetwen(
        @Param("type") type: ActivityType,
        @Param("from") from: LocalDate,
        @Param("to") to: LocalDate
    ): Long

    @Query("""
        select new org.globe42.dao.Presence(participant.id, count(participant.id)) 
        from Activity a 
        join a.participants participant
        where a.type = :type 
        and a.date between :from and :to
        group by participant.id
        """
    )
    fun countPresencesWithTypeBetween(
        @Param("type") type: ActivityType,
        @Param("from") from: LocalDate,
        @Param("to") to: LocalDate
    ): List<Presence>
}

data class Presence(
    val personId: Long,
    val count: Long
)
