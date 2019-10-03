package org.globe42.web.incomes

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSource
import org.globe42.domain.IncomeSourceType
import org.globe42.test.GlobeMvcTest
import org.globe42.web.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import java.math.BigDecimal
import java.util.*

/**
 * MVC tests for [IncomeSourceController]
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeSourceController::class)
class IncomeSourceControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {

    @MockBean
    private lateinit var mockIncomeSourceDao: IncomeSourceDao

    @MockBean
    private lateinit var mockIncomeSourceTypeDao: IncomeSourceTypeDao

    private lateinit var incomeSource: IncomeSource

    @BeforeEach
    fun prepare() {
        incomeSource = IncomeSource(42L)
        incomeSource.name = "source 1"
        incomeSource.type = IncomeSourceType(1L, "type 1")
        incomeSource.maxMonthlyAmount = BigDecimal("1234.56")
    }

    @Test
    fun `should list`() {
        whenever(mockIncomeSourceDao.findAll()).thenReturn(listOf<IncomeSource>(incomeSource))

        mvc.get("/api/income-sources").andExpect {
            status { isOk }
            jsonValue("$[0].id", 42)
            jsonValue("$[0].name", incomeSource.name)
            jsonValue("$[0].type.id", incomeSource.type.id!!)
            jsonValue("$[0].type.type", incomeSource.type.type)
            jsonValue("$[0].maxMonthlyAmount", incomeSource.maxMonthlyAmount!!.toDouble())
        }
    }

    @Test
    fun `should get`() {
        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))

        mvc.get("/api/income-sources/{sourceId}", incomeSource.id).andExpect {
            status { isOk }
            jsonValue("$.id", 42)
        }
    }

    @Test
    fun `should create`() {
        val command = createIncomeSourceCommand()
        whenever(mockIncomeSourceDao.save(any<IncomeSource>())).thenReturn(incomeSource)
        whenever(mockIncomeSourceTypeDao.findById(command.typeId)).thenReturn(Optional.of(incomeSource.type))

        mvc.post("/api/income-sources") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.id", 42)
        }
    }

    @Test
    fun `should update`() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))
        whenever(mockIncomeSourceTypeDao.findById(command.typeId)).thenReturn(Optional.of(incomeSource.type))

        mvc.put("/api/income-sources/{sourceId}", incomeSource.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
    }
}
