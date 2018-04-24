package org.globe42.dao

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

/**
 * Implementation of [UserDaoCustom]
 * @author JB Nizet
 */
class UserDaoImpl : UserDaoCustom {

    @PersistenceContext
    private lateinit var em: EntityManager

    override fun existsNotDeletedById(userId: Long) =
            existsByQueryAndId("select 1 from User u where u.id = :id and u.deleted = false", userId)

    override fun existsNotDeletedAdminById(userId: Long) =
            existsByQueryAndId("select 1 from User u where u.id = :id and u.deleted = false and u.admin = true",
                               userId)

    private fun existsByQueryAndId(jpql: String, userId: Long?): Boolean {
        val result = em.createQuery(jpql, Number::class.java)
                .setParameter("id", userId)
                .resultList
        return !result.isEmpty()
    }
}
