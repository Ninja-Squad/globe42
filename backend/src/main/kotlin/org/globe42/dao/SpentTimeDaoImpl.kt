package org.globe42.dao

import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.domain.SpentTimeStatistic
import org.globe42.domain.TaskCategory
import org.globe42.domain.User
import org.globe42.web.tasks.SpentTimeStatisticsCriteriaDTO
import java.util.*
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.persistence.TypedQuery

/**
 * Implementation of the custom methods of [SpentTimeDao], defined in [SpentTimeDaoCustom]
 * @author JB Nizet
 */
class SpentTimeDaoImpl : SpentTimeDaoCustom {

    @PersistenceContext
    private lateinit var em: EntityManager

    override fun findSpentTimeStatistics(criteria: SpentTimeStatisticsCriteriaDTO): List<SpentTimeStatistic> {
        val jpql = """select category.id, creator.id, sum(spentTime.minutes)
             from SpentTime spentTime
             join spentTime.task task
             join task.category category
             join spentTime.creator creator ${spentTimeStatisticsWhereClause(criteria)}
             group by category.id, creator.id"""

        val query = em.createQuery(jpql, Array<Any>::class.java)
        bindParameters(query, criteria)
        val list = query.resultList

        return list.map { row ->
            SpentTimeStatistic(
                em.find(TaskCategory::class.java, row[0] as Long),
                em.find(User::class.java, row[1] as Long),
                (row[2] as Number).toInt()
            )
        }
    }

    private fun spentTimeStatisticsWhereClause(criteria: SpentTimeStatisticsCriteriaDTO): String {
        val clauses = ArrayList<String>()
        if (criteria.from != null) {
            clauses.add("spentTime.creationInstant >= :fromInstant")
        }
        if (criteria.to != null) {
            clauses.add("spentTime.creationInstant < :toInstant")
        }
        return if (clauses.isEmpty()) "" else """where ${clauses.joinToString(" and ")}"""
    }

    private fun bindParameters(query: TypedQuery<Array<Any>>, criteria: SpentTimeStatisticsCriteriaDTO) {
        if (criteria.from != null) {
            query.setParameter("fromInstant", criteria.from.atStartOfDay(PARIS_TIME_ZONE).toInstant())
        }
        if (criteria.to != null) {
            query.setParameter("toInstant", criteria.to.plusDays(1).atStartOfDay(PARIS_TIME_ZONE).toInstant())
        }
    }
}
