package org.globe42.dao

import org.globe42.domain.ActivityType
import org.globe42.domain.Person
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

/**
 * DAO for the [org.globe42.domain.Person] entity
 * @author JB Nizet
 */
interface PersonDao : JpaRepository<Person, Long>, PersonDaoCustom {
    @Query("select person from Participation participation"
                   + " join participation.person person"
                   + " where participation.activityType = :activityType"
                   + " and person.deleted = false")
    fun findParticipants(@Param("activityType") activityType: ActivityType): List<Person>

    @Query("select person from Person person where person.deleted = false")
    fun findNotDeleted(): List<Person>

    @Query("select person from Person person where person.deleted = true")
    fun findDeleted(): List<Person>
}
