package org.globe42.web.incomes

import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSourceType
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * MVC tests for [IncomeSourceTypeController]
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeSourceTypeController::class)
class IncomeSourceTypeControllerMvcTest {

    @MockBean
    private lateinit var mockIncomeSourceTypeDao: IncomeSourceTypeDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    @Throws(Exception::class)
    fun `should list`() {
        whenever(mockIncomeSourceTypeDao.findAll()).thenReturn(listOf(IncomeSourceType(1L, "type1")))

        mvc.perform(get("/api/income-source-types"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].type").value("type1"))
    }
}
