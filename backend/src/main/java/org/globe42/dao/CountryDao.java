package org.globe42.dao;

import java.util.List;

import org.globe42.domain.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * DAO for the {@link Country} entity
 * @author JB Nizet
 */
public interface CountryDao extends JpaRepository<Country, String> {
    @Query("select c from Country c order by c.name")
    List<Country> findAllSortedByName();
}
