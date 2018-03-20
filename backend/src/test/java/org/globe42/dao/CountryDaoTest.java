package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.Country;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Unit tests for {@link CountryDao}
 * @author JB Nizet
 */
public class CountryDaoTest extends BaseDaoTest {

    @Autowired
    private CountryDao countryDao;

    @BeforeEach
    public void prepare() {
        Operation countries =
            Insert.into("country")
                  .columns("id", "name")
                  .values("FRA", "France")
                  .values("BEL", "Belgique")
                  .build();
        dbSetup(countries);
    }

    @Test
    public void shouldListSortedByName() {
        assertThat(countryDao.findAllSortedByName())
            .extracting(Country::getName)
            .containsExactly("Belgique", "France");
    }
}
