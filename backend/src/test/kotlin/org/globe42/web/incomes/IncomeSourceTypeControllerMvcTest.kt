package org.globe42.web.incomes

import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSourceType
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

/**
 * MVC tests for [IncomeSourceTypeController]
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeSourceTypeController::class)
class IncomeSourceTypeControllerMvcTest(@Autowired private val mvc: MockMvc) {

    @MockBean
    private lateinit var mockIncomeSourceTypeDao: IncomeSourceTypeDao

    @Test
    fun `should list`() {
        whenever(mockIncomeSourceTypeDao.findAll()).thenReturn(listOf(IncomeSourceType(1L, "type1")))

        mvc.get("/api/income-source-types").andExpect {
            status { isOk }
            jsonValue("$[0].id", 1)
            jsonValue("$[0].type", "type1")
        }
    }
}
