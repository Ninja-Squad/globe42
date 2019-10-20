package org.globe42.web.charges

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.ChargeCategoryDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.domain.ChargeCategory
import org.globe42.domain.ChargeType
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import java.math.BigDecimal

/**
 * MVC tests for [ChargeTypeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeTypeController::class)
class ChargeTypeControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {

    @MockkBean
    private lateinit var mockChargeTypeDao: ChargeTypeDao

    @MockkBean
    private lateinit var mockChargeCategoryDao: ChargeCategoryDao

    private lateinit var chargeType: ChargeType

    @BeforeEach
    fun prepare() {
        chargeType = ChargeType(42L).apply {
            name = "source 1"
            category = ChargeCategory(1L, "category 1")
            maxMonthlyAmount = BigDecimal("1234.56")
        }
    }

    @Test
    fun `should list`() {
        every { mockChargeTypeDao.findAll() }  returns listOf(chargeType)

        mvc.get("/api/charge-types").andExpect {
            status { isOk }
            jsonValue("$[0].id", 42)
            jsonValue("$[0].name", chargeType.name)
            jsonValue("$[0].category.id", chargeType.category.id!!)
            jsonValue("$[0].category.name", chargeType.category.name)
            jsonValue("$[0].maxMonthlyAmount", chargeType.maxMonthlyAmount!!.toDouble())
        }
    }

    @Test
    fun `should get`() {
        every { mockChargeTypeDao.findByIdOrNull(chargeType.id!!) } returns chargeType

        mvc.get("/api/charge-types/{typeId}", chargeType.id).andExpect {
            status { isOk }
            jsonValue("$.id", 42)
        }
    }

    @Test
    fun `should create`() {
        val command = createCommand()
        every { mockChargeTypeDao.existsByName(command.name) } returns false
        every { mockChargeTypeDao.save(any<ChargeType>())} returns chargeType
        every { mockChargeCategoryDao.findByIdOrNull(command.categoryId) } returns chargeType.category

        mvc.post("/api/charge-types") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.id", 42)
        }
    }

    @Test
    fun `should update`() {
        val command = createCommand()

        every { mockChargeTypeDao.findByName(command.name) } returns null
        every { mockChargeTypeDao.findByIdOrNull(chargeType.id!!) } returns chargeType
        every { mockChargeCategoryDao.findByIdOrNull(command.categoryId) } returns chargeType.category

        mvc.put("/api/charge-types/{sourceId}", chargeType.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
    }
}
