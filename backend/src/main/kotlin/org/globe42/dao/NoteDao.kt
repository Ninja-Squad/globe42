package org.globe42.dao

import org.globe42.domain.Note
import org.globe42.domain.Person
import org.springframework.data.repository.query.Param
import java.time.Instant
import javax.persistence.EntityManager

/**
 * DAO for [Note]
 * @author JB Nizet
 */
interface NoteDao : GlobeRepository<Note, Long>, NoteDaoCustom

interface NoteDaoCustom {
    fun findBetweenWithPerson(@Param("fromInclusive") fromInclusive: Instant, @Param("toExclusive") toExclusive: Instant): List<Pair<Note, Person>>
}

class NoteDaoCustomImpl(private val em: EntityManager) : NoteDaoCustom {
    @Suppress("UNCHECKED_CAST")
    override fun findBetweenWithPerson(fromInclusive: Instant, toExclusive: Instant): List<Pair<Note, Person>> {
        val jpql = """
            select note, person from Person person
            inner join person.notes note
            where note.category = org.globe42.domain.NoteCategory.APPOINTMENT
            and note.creationInstant >= :fromInclusive
            and note.creationInstant < :toExclusive
        """.trimIndent()
        val rows =
            em.createQuery(jpql)
                .setParameter("fromInclusive", fromInclusive)
                .setParameter("toExclusive", toExclusive)
                .resultList as List<Array<Any>>;
        return rows.map { (note, person) -> (note as Note) to (person as Person) }
    }
}
