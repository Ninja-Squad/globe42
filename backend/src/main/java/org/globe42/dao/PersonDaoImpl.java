package org.globe42.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Implementation of {@link PersonDaoCustom}
 * @author JB Nizet
 */
public class PersonDaoImpl implements PersonDaoCustom {
    @PersistenceContext
    private EntityManager em;

    @Override
    public int nextMediationCode(char letter) {
        String query = "select nextval('mediation_code_" + letter + "_seq')";
        return ((Number) em.createNativeQuery(query).getSingleResult()).intValue();
    }
}
