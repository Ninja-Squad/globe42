package org.globe42.dao

import org.globe42.domain.PostalCity
import java.text.Normalizer
import java.util.stream.Collectors
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

/**
 * Implementation of custom methods of [PostalCityDao]
 * @author JB Nizet
 */
class PostalCityDaoCustomImpl : PostalCityDaoCustom {

    @PersistenceContext
    private lateinit var em: EntityManager

    override fun saveAllEfficiently(cities: Collection<PostalCity>) {
        var counter = 0
        for (city in cities) {
            em.persist(city)
            counter++
            if (counter == 50) {
                counter = 0
                em.flush()
                em.clear()
            }
        }
    }

    override fun findByPostalCode(search: String, limit: Int): List<PostalCity> {
        val jpql = "select pc from PostalCity pc where pc.postalCode like :value order by pc.postalCode, pc.city"
        val query = em.createQuery(jpql, PostalCity::class.java)
        return query.setParameter("value", "$search%")
            .setMaxResults(limit)
            .resultList
    }

    override fun findByCity(search: String, limit: Int): List<PostalCity> {
        val jpql = "select pc from PostalCity pc where upper(pc.city) like :value order by pc.city, pc.postalCode"
        val query = em.createQuery(jpql, PostalCity::class.java)
        return query.setParameter("value", sanitizeQuery(search) + "%")
            .setMaxResults(limit)
            .resultList
    }

    private fun sanitizeQuery(search: String): String {
        // Use uppercase
        var result = search.uppercase()
        // replace dashed and commas with spaces, since thre is none in the data
        result = result.replace('\'', ' ').replace('-', ' ')
        // remove accents
        result = Normalizer.normalize(result, Normalizer.Form.NFD).replace("[^\\p{ASCII}]".toRegex(), "")

        // strip in parts to make sure there is a single space between parts
        result = result.split(' ')
            .stream()
            .filter { !it.isBlank() }
            .map { if (it == "SAINT") "ST" else it }
            .collect(Collectors.joining(" "))
        return result
    }
}
