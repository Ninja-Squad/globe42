package org.globe42.web.cities

import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.PostalCityDao
import org.globe42.domain.PostalCity
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.*

/**
 * MVC tests for [PostalCityController]
 * @author JB Nizet
 */
@GlobeMvcTest(PostalCityController::class)
class PostalCityControllerMvcTest {

    @MockBean
    private lateinit var mockPostalCityDao: PostalCityDao

    @MockBean
    private lateinit var mockUploadParser: PostalCityUploadParser

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun shouldSearch() {
        val postalCity = PostalCity("42000", "ST ETIENNE")
        whenever(mockPostalCityDao.findByCity("ST E", LIMIT)).thenReturn(listOf(postalCity))

        mvc.perform(get("/api/cities").param("query", "ST E"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$[0].code").value("42000"))
                .andExpect(jsonPath("$[0].city").value("ST ETIENNE"))
    }

    @Test
    @Throws(Exception::class)
    fun shouldUpload() {
        val body = "fake".toByteArray()
        val parsedCities = Arrays.asList(PostalCity("42000", "ST ETIENNE"))
        whenever(mockUploadParser.parse(body)).thenReturn(parsedCities)

        mvc.perform(post("/api/cities/uploads").content(body))
                .andExpect(status().isCreated)

        verify(mockPostalCityDao).saveAllEfficiently(parsedCities)
    }
}
