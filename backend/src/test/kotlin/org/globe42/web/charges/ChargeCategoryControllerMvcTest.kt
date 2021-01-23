package org.globe42.web.charges

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.ChargeCategoryDao
import org.globe42.domain.ChargeCategory
import org.globe42.test.GlobeMvcTest
import org.globe42.web.incomes.IncomeSourceTypeController
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * MVC tests for [IncomeSourceTypeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeCategoryController::class)
class ChargeCategoryControllerMvcTest {

    @MockkBean
    private lateinit var mockChargeCategoryDao: ChargeCategoryDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun `should list`() {
        every { mockChargeCategoryDao.findAll() } returns listOf(ChargeCategory(1L, "category1"))

        mvc.get("/api/charge-categories")
            .andExpect {
                status().isOk()
                jsonValue("$[0].id", 1)
                jsonValue("$[0].name", "category1")
            }
    }
}
