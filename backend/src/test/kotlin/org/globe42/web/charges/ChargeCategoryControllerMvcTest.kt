package org.globe42.web.charges

import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.ChargeCategoryDao
import org.globe42.domain.ChargeCategory
import org.globe42.test.GlobeMvcTest
import org.globe42.web.incomes.IncomeSourceTypeController
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
@GlobeMvcTest(ChargeCategoryController::class)
class ChargeCategoryControllerMvcTest {

    @MockBean
    private lateinit var mockChargeCategoryDao: ChargeCategoryDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun `should list`() {
        whenever(mockChargeCategoryDao.findAll()).thenReturn(listOf(ChargeCategory(1L, "category1")))

        mvc.perform(get("/api/charge-categories"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].name").value("category1"))
    }
}
