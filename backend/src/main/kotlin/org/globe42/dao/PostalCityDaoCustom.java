package org.globe42.dao;

import java.util.Collection;
import java.util.List;

import org.globe42.domain.PostalCity;

/**
 * Custom methods of {@link PostalCityDao}
 * @author JB Nizet
 */
public interface PostalCityDaoCustom {

    /**
     * Inserts all the given cities in an efficient way
     */
    void saveAllEfficiently(Collection<PostalCity> cities);

    /**
     * Finds the N first cities whose postal code starts with the given value
     */
    List<PostalCity> findByPostalCode(String search, int limit);

    /**
     * Finds the N first cities whose name start with the given value, after sanitization
     */
    List<PostalCity> findByCity(String search, int limit);
}
