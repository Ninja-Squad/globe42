package org.globe42.dao

import org.globe42.domain.Membership
import org.globe42.domain.Person
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

/**
 * DAO for [Membership]
 * @author JB Nizet
 */
interface MembershipDao : GlobeRepository<Membership, Long> {

    @Query("select m from Membership m where m.person = :person order by year desc")
    fun findByPerson(@Param("person") person: Person): List<Membership>

    @Query("select m from Membership m where m.person = :person and m.year = :year")
    fun findByPersonAndYear(@Param("person") person: Person, @Param("year") year: Int): Membership?

    @Query("select m from Membership m where m.year = :year")
    fun findByYear(@Param("year") year: Int): List<Membership>

    @Query("""select m from Membership m 
        left join fetch m.person p
        order by m.year, p.firstName, p.lastName""")
    fun list(): List<Membership>
}
