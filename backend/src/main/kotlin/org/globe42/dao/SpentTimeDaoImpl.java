package org.globe42.dao;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.globe42.domain.SpentTimeStatistic;
import org.globe42.domain.TaskCategory;
import org.globe42.domain.User;
import org.globe42.web.tasks.SpentTimeStatisticsCriteriaDTO;

/**
 * Implementation of the custom methods of {@link SpentTimeDao}, defined in {@link SpentTimeDaoCustom}
 * @author JB Nizet
 */
public class SpentTimeDaoImpl implements SpentTimeDaoCustom {

    private static final ZoneId PARIS_TIME_ZONE = ZoneId.of("Europe/Paris");

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<SpentTimeStatistic> findSpentTimeStatistics(SpentTimeStatisticsCriteriaDTO criteria) {
        String jpql =
            "select category.id, creator.id, sum(spentTime.minutes) from SpentTime spentTime"
                + " join spentTime.task task "
                + " join task.category category "
                + " join spentTime.creator creator "
                + spentTimeStatisticsWhereClause(criteria)
                + " group by category.id, creator.id";

        TypedQuery<Object[]> query = em.createQuery(jpql, Object[].class);
        bindParameters(query, criteria);
        List<Object[]> list = query.getResultList();

        return list.stream()
                   .map(row -> new SpentTimeStatistic(em.find(TaskCategory.class, (Long) row[0]),
                                                      em.find(User.class, (Long) row[1]),
                                                      ((Number) row[2]).intValue()))
                   .collect(Collectors.toList());
    }

    private String spentTimeStatisticsWhereClause(SpentTimeStatisticsCriteriaDTO criteria) {
        List<String> clauses = new ArrayList<>();
        if (criteria.getFromDate() != null) {
            clauses.add("spentTime.creationInstant >= :fromInstant");
        }
        if (criteria.getToDate() != null) {
            clauses.add("spentTime.creationInstant < :toInstant");
        }
        return clauses.isEmpty() ? "" : "where " + clauses.stream().collect(Collectors.joining(" and "));
    }

    private void bindParameters(TypedQuery<Object[]> query, SpentTimeStatisticsCriteriaDTO criteria) {
        if (criteria.getFromDate() != null) {
            query.setParameter("fromInstant", criteria.getFromDate().atStartOfDay(PARIS_TIME_ZONE).toInstant());
        }
        if (criteria.getToDate() != null) {
            query.setParameter("toInstant", criteria.getToDate().plusDays(1).atStartOfDay(PARIS_TIME_ZONE).toInstant());
        }
    }
}
