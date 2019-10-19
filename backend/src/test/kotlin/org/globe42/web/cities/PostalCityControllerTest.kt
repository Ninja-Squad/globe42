package org.globe42.web.cities

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PostalCityDao
import org.globe42.domain.PostalCity
import org.junit.jupiter.api.Test
import java.util.*

/**
 * Unit tests for [PostalCityController]
 * @author JB Nizet
 */
class PostalCityControllerTest {
    private val mockPostalCityDao = mockk<PostalCityDao>(relaxUnitFun = true)

    private val mockUploadParser = mockk<PostalCityUploadParser>()

    private val controller = PostalCityController(mockPostalCityDao, mockUploadParser)

    @Test
    fun `should search by postal code when query is numeric`() {
        val postalCity = PostalCity("42000", "ST ETIENNE")
        every { mockPostalCityDao.findByPostalCode("420", LIMIT) } returns listOf(postalCity)

        val result = controller.search("420")

        assertThat(result).hasSize(1)
        assertThat(result[0].code).isEqualTo(postalCity.postalCode)
        assertThat(result[0].city).isEqualTo(postalCity.city)
    }

    @Test
    fun `should search by city when query is not numeric`() {
        val postalCity = PostalCity("42000", "ST ETIENNE")
        every { mockPostalCityDao.findByCity("ST ET", LIMIT) } returns listOf(postalCity)

        val result = controller.search("ST ET")

        assertThat(result).hasSize(1)
        assertThat(result[0].code).isEqualTo(postalCity.postalCode)
        assertThat(result[0].city).isEqualTo(postalCity.city)
    }

    @Test
    fun `should upload`() {
        val body = "fake".toByteArray()
        val parsedCities = Arrays.asList(PostalCity("42000", "ST ETIENNE"))
        every { mockUploadParser.parse(body) } returns parsedCities

        controller.upload(body)

        verify { mockPostalCityDao.saveAllEfficiently(parsedCities) }
    }
}
