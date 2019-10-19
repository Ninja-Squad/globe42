package org.globe42.web.countries

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.CountryDao
import org.globe42.domain.Country
import org.junit.jupiter.api.Test

/**
 * Unit test for [CountryController]
 * @author JB Nizet
 */
class CountryControllerTest {

    private val mockCountryDao = mockk<CountryDao>()

    private val controller = CountryController(mockCountryDao)

    @Test
    fun `should list`() {
        every { mockCountryDao.findAllSortedByName() } returns
            listOf(Country("BEL", "Belgique"), Country("FRA", "France"))

        val result = controller.list()

        assertThat(result).containsExactly(
            CountryDTO("BEL", "Belgique"),
            CountryDTO("FRA", "France")
        )
    }
}
