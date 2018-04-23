package org.globe42.web.countries

import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.CountryDao
import org.globe42.domain.Country
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * MVC test for [CountryController]
 * @author JB Nizet
 */
@GlobeMvcTest(CountryController::class)
class CountryControllerMvcTest {

    @MockBean
    private lateinit var mockCountryDao: CountryDao

    @Autowired
    private lateinit var mvc: MockMvc

    @BeforeEach
    fun prepare() {
        whenever(mockCountryDao.findAllSortedByName()).thenReturn(
            listOf(Country("BEL", "Belgique"), Country("FRA", "France"))
        )
    }

    @Test
    fun `should list`() {
        mvc.perform(get("/api/countries"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value("BEL"))
            .andExpect(jsonPath("$[1].name").value("France"))
    }
}
