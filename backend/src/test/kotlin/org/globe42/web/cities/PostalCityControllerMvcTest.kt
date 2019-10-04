package org.globe42.web.cities

import com.nhaarman.mockitokotlin2.verify
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.PostalCityDao
import org.globe42.domain.PostalCity
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.util.*

/**
 * MVC tests for [PostalCityController]
 * @author JB Nizet
 */
@GlobeMvcTest(PostalCityController::class)
class PostalCityControllerMvcTest(@Autowired private val mvc: MockMvc) {

    @MockBean
    private lateinit var mockPostalCityDao: PostalCityDao

    @MockBean
    private lateinit var mockUploadParser: PostalCityUploadParser

    @Test
    fun `should search`() {
        val postalCity = PostalCity("42000", "ST ETIENNE")
        whenever(mockPostalCityDao.findByCity("ST E", LIMIT)).thenReturn(listOf(postalCity))

        mvc.get("/api/cities") {
            param("query", "ST E")
        }.andExpect {
            status { isOk }
            jsonValue("$[0].code", "42000")
            jsonValue("$[0].city", "ST ETIENNE")
        }
    }

    @Test
    fun `should upload`() {
        val body = "fake".toByteArray()
        val parsedCities = Arrays.asList(PostalCity("42000", "ST ETIENNE"))
        whenever(mockUploadParser.parse(body)).thenReturn(parsedCities)

        mvc.post("/api/cities/uploads") {
            content = body
        }.andExpect {
            status { isCreated }
        }

        verify(mockPostalCityDao).saveAllEfficiently(parsedCities)
    }
}
