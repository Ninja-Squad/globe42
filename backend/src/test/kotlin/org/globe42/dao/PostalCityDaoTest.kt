package org.globe42.dao

import org.assertj.core.api.Java6Assertions.assertThat
import org.globe42.domain.PostalCity
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.util.*

/**
 * Tests for [PostalCityDao]
 * @author JB Nizet
 */
class PostalCityDaoTest : BaseDaoTest() {
    @Autowired
    private lateinit var dao: PostalCityDao

    @BeforeEach
    fun prepare() {
        setup {
            insertInto("postal_city") {
                columns("id", "postal_code", "city")
                values(1L, "01160", "PONT D AIN")
                values(2L, "42000", "ST ETIENNE")
                values(3L, "42100", "ST ETIENNE")
                values(4L, "08310", "ST ETIENNE A ARNES")
            }
        }
    }

    @Test
    fun shouldFindByPostalCode() {
        skipNextLaunch()
        var result = dao.findByPostalCode("42", 10)
        assertThat(result).extracting<Long>(PostalCity::id).containsExactly(2L, 3L)

        result = dao.findByPostalCode("0", 1)
        assertThat(result).extracting<Long>(PostalCity::id).containsExactly(1L)
    }

    @Test
    fun shouldFindByCity() {
        skipNextLaunch()
        var result = dao.findByCity("Saint   étienne", 10)
        assertThat(result).extracting<Long>(PostalCity::id).containsExactly(2L, 3L, 4L)

        result = dao.findByCity("Pont d'ain", 10)
        assertThat(result).extracting<Long>(PostalCity::id).containsExactly(1L)

        result = dao.findByCity("Saint   étienne", 1)
        assertThat(result).extracting<Long>(PostalCity::id).containsExactly(2L)
    }

    @Test
    fun shouldSaveEfficiently() {
        val list = Arrays.asList(
                PostalCity("69000", "LYON"),
                PostalCity("42170", "ST JUST ST RAMBERT")
        )
        dao.saveAllEfficiently(list)

        assertThat(dao.findByPostalCode("69", 10)).hasSize(1)
    }
}
