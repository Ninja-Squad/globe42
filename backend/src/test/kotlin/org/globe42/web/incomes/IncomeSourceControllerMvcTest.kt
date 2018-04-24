package org.globe42.web.incomes

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSource
import org.globe42.domain.IncomeSourceType
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
 * MVC tests for [IncomeSourceController]
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeSourceController::class)
class IncomeSourceControllerMvcTest {

    @MockBean
    private lateinit var mockIncomeSourceDao: IncomeSourceDao

    @MockBean
    private lateinit var mockIncomeSourceTypeDao: IncomeSourceTypeDao

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var mvc: MockMvc

    private lateinit var incomeSource: IncomeSource

    @BeforeEach
    fun prepare() {
        incomeSource = IncomeSource(42L)
        incomeSource.name = "source 1"
        incomeSource.type = IncomeSourceType(1L, "type 1")
        incomeSource.maxMonthlyAmount = BigDecimal("1234.56")
    }

    @Test
    @Throws(Exception::class)
    fun shouldList() {
        whenever(mockIncomeSourceDao.findAll()).thenReturn(listOf<IncomeSource>(incomeSource))

        mvc.perform(get("/api/income-sources"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$[0].id").value(42))
                .andExpect(jsonPath("$[0].name").value(incomeSource.name!!))
                .andExpect(jsonPath("$[0].type.id").value(incomeSource.type!!.id!!))
                .andExpect(jsonPath("$[0].type.type").value(incomeSource.type!!.type!!))
                .andExpect(jsonPath("$[0].maxMonthlyAmount").value(incomeSource.maxMonthlyAmount!!.toDouble()))
    }

    @Test
    @Throws(Exception::class)
    fun shouldGet() {
        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))

        mvc.perform(get("/api/income-sources/{sourceId}", incomeSource.id))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.id").value(42))
    }

    @Test
    @Throws(Exception::class)
    fun shouldCreate() {
        val command = createIncomeSourceCommand()
        whenever(mockIncomeSourceDao.save(any<IncomeSource>())).thenReturn(incomeSource)
        whenever(mockIncomeSourceTypeDao.findById(command.typeId)).thenReturn(Optional.of(incomeSource.type!!))

        mvc.perform(post("/api/income-sources")
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.id").value(42))
    }

    @Test
    @Throws(Exception::class)
    fun shouldUpdate() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))
        whenever(mockIncomeSourceTypeDao.findById(command.typeId)).thenReturn(Optional.of(incomeSource.type!!))

        mvc.perform(put("/api/income-sources/{sourceId}", incomeSource.id)
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isNoContent)
    }
}
