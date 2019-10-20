package org.globe42.dao

import org.globe42.domain.Membership
import org.globe42.domain.Person
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

/**
 * DAO for [Membership]
 * @author JB Nizet
 */
interface MembershipDao : JpaRepository<Membership, Long> {

    @Query("select m from Membership m where m.person = :person order by year desc")
    fun findByPerson(@Param("person") person: Person): List<Membership>

    @Query("select m from Membership m where m.person = :person and m.year = :year")
    fun findByPersonAndYear(@Param("person") person: Person, @Param("year") year: Int): Membership?
}
