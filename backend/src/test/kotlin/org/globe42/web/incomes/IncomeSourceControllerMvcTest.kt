package org.globe42.web.incomes

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSource
import org.globe42.domain.IncomeSourceType
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import java.math.BigDecimal

/**
 * MVC tests for [IncomeSourceController]
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeSourceController::class)
class IncomeSourceControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {

    @MockkBean
    private lateinit var mockIncomeSourceDao: IncomeSourceDao

    @MockkBean
    private lateinit var mockIncomeSourceTypeDao: IncomeSourceTypeDao

    private lateinit var incomeSource: IncomeSource

    @BeforeEach
    fun prepare() {
        incomeSource = IncomeSource(42L).apply {
            name = "source 1"
            type = IncomeSourceType(1L, "type 1")
            maxMonthlyAmount = BigDecimal("1234.56")
        }
    }

    @Test
    fun `should list`() {
        every { mockIncomeSourceDao.findAll() } returns listOf(incomeSource)

        mvc.get("/api/income-sources").andExpect {
            status { isOk() }
            jsonValue("$[0].id", 42)
            jsonValue("$[0].name", incomeSource.name)
            jsonValue("$[0].type.id", incomeSource.type.id!!)
            jsonValue("$[0].type.type", incomeSource.type.type)
            jsonValue("$[0].maxMonthlyAmount", incomeSource.maxMonthlyAmount!!.toDouble())
        }
    }

    @Test
    fun `should get`() {
        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) }  returns incomeSource

        mvc.get("/api/income-sources/{sourceId}", incomeSource.id).andExpect {
            status { isOk() }
            jsonValue("$.id", 42)
        }
    }

    @Test
    fun `should create`() {
        val command = createIncomeSourceCommand()
        every { mockIncomeSourceDao.existsByName(command.name) } returns false
        every { mockIncomeSourceDao.save(any<IncomeSource>())} returns incomeSource
        every { mockIncomeSourceTypeDao.findByIdOrNull(command.typeId) } returns incomeSource.type

        mvc.post("/api/income-sources") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated() }
            jsonValue("$.id", 42)
        }
    }

    @Test
    fun `should update`() {
        val command = createIncomeSourceCommand()

        every { mockIncomeSourceDao.findByName(command.name) } returns null
        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns incomeSource
        every { mockIncomeSourceTypeDao.findByIdOrNull(command.typeId) } returns incomeSource.type

        mvc.put("/api/income-sources/{sourceId}", incomeSource.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent() }
        }
    }
}
