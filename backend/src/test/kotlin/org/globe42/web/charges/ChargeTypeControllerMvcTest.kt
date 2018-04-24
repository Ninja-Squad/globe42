package org.globe42.web.charges

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.ChargeCategoryDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.domain.ChargeCategory
import org.globe42.domain.ChargeType
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal
import java.util.*

/**
 * MVC tests for [ChargeTypeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeTypeController::class)
class ChargeTypeControllerMvcTest {

    @MockBean
    private lateinit var mockChargeTypeDao: ChargeTypeDao

    @MockBean
    private lateinit var mockChargeCategoryDao: ChargeCategoryDao

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var mvc: MockMvc

    private lateinit var chargeType: ChargeType

    @BeforeEach
    fun prepare() {
        chargeType = ChargeType(42L)
        chargeType.name = "source 1"
        chargeType.category = ChargeCategory(1L, "category 1")
        chargeType.maxMonthlyAmount = BigDecimal("1234.56")
    }

    @Test
    fun shouldList() {
        whenever(mockChargeTypeDao.findAll()).thenReturn(listOf<ChargeType>(chargeType))

        mvc.perform(get("/api/charge-types"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$[0].id").value(42))
                .andExpect(jsonPath("$[0].name").value(chargeType.name!!))
                .andExpect(jsonPath("$[0].category.id").value(chargeType.category!!.id!!))
                .andExpect(jsonPath("$[0].category.name").value(chargeType.category!!.name!!))
                .andExpect(jsonPath("$[0].maxMonthlyAmount").value(chargeType.maxMonthlyAmount!!.toDouble()))
    }

    @Test
    fun shouldGet() {
        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.of(chargeType))

        mvc.perform(get("/api/charge-types/{typeId}", chargeType.id))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.id").value(42))
    }

    @Test
    fun shouldCreate() {
        val command = createCommand()
        whenever(mockChargeTypeDao.save(any<ChargeType>())).thenReturn(chargeType)
        whenever(mockChargeCategoryDao.findById(command.categoryId)).thenReturn(Optional.of(chargeType.category!!))

        mvc.perform(post("/api/charge-types")
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.id").value(42))
    }

    @Test
    fun shouldUpdate() {
        val command = createCommand()

        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.of(chargeType))
        whenever(mockChargeCategoryDao.findById(command.categoryId)).thenReturn(Optional.of(chargeType.category!!))

        mvc.perform(put("/api/charge-types/{sourceId}", chargeType.id)
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isNoContent)
    }
}
