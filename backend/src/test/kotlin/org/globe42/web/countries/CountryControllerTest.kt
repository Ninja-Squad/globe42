package org.globe42.web.countries

import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Java6Assertions.assertThat
import org.globe42.dao.CountryDao
import org.globe42.domain.Country
import org.globe42.test.BaseTest
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock

/**
 * Unit test for [CountryController]
 * @author JB Nizet
 */
class CountryControllerTest : BaseTest() {

    @Mock
    private lateinit var mockCountryDao: CountryDao

    @InjectMocks
    private lateinit var controller: CountryController

    @Test
    fun `should list`() {
        whenever(mockCountryDao.findAllSortedByName()).thenReturn(
            listOf(Country("BEL", "Belgique"), Country("FRA", "France"))
        )

        val result = controller.list()

        assertThat(result).containsExactly(
            CountryDTO("BEL", "Belgique"),
            CountryDTO("FRA", "France")
        )
    }
}
