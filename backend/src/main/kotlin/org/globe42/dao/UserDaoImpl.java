package org.globe42.dao;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Implementation of {@link UserDaoCustom}
 * @author JB Nizet
 */
public class UserDaoImpl implements UserDaoCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public boolean existsNotDeletedById(Long userId) {
        return existsByQueryAndId("select 1 from User u where u.id = :id and u.deleted = false",
                                  userId);
    }

    @Override
    public boolean existsNotDeletedAdminById(Long userId) {
        return existsByQueryAndId("select 1 from User u where u.id = :id and u.deleted = false and u.admin = true",
                                  userId);
    }

    private boolean existsByQueryAndId(String jpql, Long userId) {
        List<Number> result = em.createQuery(jpql, Number.class)
                                .setParameter("id", userId)
                                .getResultList();
        return !result.isEmpty();
    }
}
