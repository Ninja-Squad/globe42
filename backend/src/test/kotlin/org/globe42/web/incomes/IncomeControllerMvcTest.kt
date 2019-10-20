package org.globe42.web.incomes

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.IncomeDao
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Income
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.math.BigDecimal

/**
 * MVC tests for [IncomeController]
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeController::class)
class IncomeControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    @MockkBean(relaxUnitFun = true)
    private lateinit var mockIncomeDao: IncomeDao

    @MockkBean
    private lateinit var mockIncomeSourceDao: IncomeSourceDao

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
    }

    @Test
    fun `should list`() {
        val income = createIncome(12L)
        person.addIncome(income)

        mvc.get("/api/persons/{personId}/incomes", person.id).andExpect {
            status { isOk }
            jsonValue("$[0].id", income.id!!.toInt())
            jsonValue("$[0].monthlyAmount", income.monthlyAmount.toDouble())
            jsonValue("$[0].source.id", income.source.id!!.toInt())
        }
    }

    @Test
    fun `should delete`() {
        val income = createIncome(12L)
        person.addIncome(income)

        every { mockIncomeDao.findByIdOrNull(income.id!!) } returns income

        mvc.delete("/api/persons/{personId}/incomes/{incomeId}", person.id, income.id).andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should create`() {
        val incomeSource = createIncomeSource(12L)

        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns incomeSource
        every { mockIncomeDao.save(any<Income>()) } answers { arg<Income>(0).apply { id = 345L } }

        val command = IncomeCommandDTO(incomeSource.id!!, BigDecimal.TEN)
        mvc.post("/api/persons/{personId}/incomes", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.id", 345)
        }
    }
}
