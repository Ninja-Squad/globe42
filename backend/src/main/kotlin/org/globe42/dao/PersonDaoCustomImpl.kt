package org.globe42.dao

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

/**
 * Implementation of [PersonDaoCustom]
 * @author JB Nizet
 */
class PersonDaoCustomImpl : PersonDaoCustom {
    @PersistenceContext
    private lateinit var em: EntityManager

    override fun nextMediationCode(letter: Char): Int {
        val query = "select nextval('mediation_code_${letter}_seq')"
        return (em.createNativeQuery(query).singleResult as Number).toInt()
    }
}
