package org.globe42.dao

import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.Country
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

/**
 * Unit tests for [CountryDao]
 * @author JB Nizet
 */
class CountryDaoTest : BaseDaoTest() {

    @Autowired
    private lateinit var countryDao: CountryDao

    @BeforeEach
    fun prepare() {
        setup {
            insertInto("country") {
                columns("id", "name")
                values("FRA", "France")
                values("BEL", "Belgique")
            }
        }
    }

    @Test
    fun `should list sorted by name`() {
        assertThat(countryDao.findAllSortedByName())
            .extracting<String>(Country::name)
            .containsExactly("Belgique", "France")
    }
}
