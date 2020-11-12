package org.globe42.web.countries

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.CountryDao
import org.globe42.domain.Country
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

/**
 * MVC test for [CountryController]
 * @author JB Nizet
 */
@GlobeMvcTest(CountryController::class)
class CountryControllerMvcTest(@Autowired private val mvc: MockMvc) {

    @MockkBean
    private lateinit var mockCountryDao: CountryDao

    @BeforeEach
    fun prepare() {
        every { mockCountryDao.findAllSortedByName() } returns
            listOf(Country("BEL", "Belgique"), Country("FRA", "France"))
    }

    @Test
    fun `should list`() {
        mvc.get("/api/countries").andExpect {
            status { isOk() }
            jsonValue("$[0].id", "BEL")
            jsonValue("$[1].name", "France")
        }
    }
}
