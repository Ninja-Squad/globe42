package org.globe42.dao;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.globe42.domain.PostalCity;

/**
 * Implementation of custom methods of {@link PostalCityDao}
 * @author JB Nizet
 */
public class PostalCityDaoImpl implements PostalCityDaoCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void saveAllEfficiently(Collection<PostalCity> cities) {
        int counter = 0;
        for (PostalCity city : cities) {
            em.persist(city);
            counter++;
            if (counter == 50) {
                counter = 0;
                em.flush();
                em.clear();
            }
        }
    }

    @Override
    public List<PostalCity> findByPostalCode(String search, int limit) {
        String jpql = "select pc from PostalCity pc where pc.postalCode like :value order by pc.postalCode, pc.city";
        TypedQuery<PostalCity> query = em.createQuery(jpql, PostalCity.class);
        return query.setParameter("value", search + "%")
                    .setMaxResults(limit)
                    .getResultList();
    }

    @Override
    public List<PostalCity> findByCity(String search, int limit) {
        String jpql = "select pc from PostalCity pc where upper(pc.city) like :value order by pc.city, pc.postalCode";
        TypedQuery<PostalCity> query = em.createQuery(jpql, PostalCity.class);
        return query.setParameter("value", sanitizeQuery(search)+ "%")
                    .setMaxResults(limit)
                    .getResultList();
    }

    private String sanitizeQuery(String search) {
        // Use uppercase
        String result = search.toUpperCase();
        // replace dashed and commas with spaces, since thre is none in the data
        result = result.replace('\'', ' ').replace('-', ' ');
        // remove accents
        result = Normalizer.normalize(result, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");

        // strip in parts to make sure there is a single space between parts
        String[] split = result.split(" ");
        List<String> parts = new ArrayList<>();
        for (String part : split) {
            String trimmedPart = part.trim();
            if (!trimmedPart.isEmpty()) {
                // replace SAINT by ST, since that's what the daaset uses
                if (trimmedPart.equals("SAINT")) {
                    parts.add("ST");
                }
                else {
                    parts.add(trimmedPart);
                }
            }
        }
        result = parts.stream().collect(Collectors.joining(" "));
        return result;
    }
}
