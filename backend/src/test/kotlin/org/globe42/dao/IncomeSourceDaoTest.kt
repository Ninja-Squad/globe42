package org.globe42.dao

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

/**
 * Tests for [IncomeSourceDao]
 * @author JB Nizet
 */
class IncomeSourceDaoTest : BaseDaoTest() {

    @Autowired
    private lateinit var dao: IncomeSourceDao

    @BeforeEach
    fun prepare() {
        setup {
            insertInto("income_source_type") {
                columns("id", "type")
                values(1L, "pension")
            }

            insertInto("income_source") {
                columns("id", "type_id", "name", "max_monthly_amount")
                values(1L, 1L, "agirc", 5000.55)
            }
        }
    }

    @Test
    fun `should find if exists by name`() {
        skipNextLaunch()
        assertThat(dao.existsByName("hello")).isFalse()
        assertThat(dao.existsByName("agirc")).isTrue()
    }

    @Test
    fun `should find by name`() {
        skipNextLaunch()
        assertThat(dao.findByName("hello")).isNull()
        assertThat(dao.findByName("agirc")).isNotNull
    }
}
