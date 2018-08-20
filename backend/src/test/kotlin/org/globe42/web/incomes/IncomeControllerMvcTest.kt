package org.globe42.web.incomes

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.IncomeDao
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Income
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
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
 * MVC tests for [IncomeController]
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeController::class)
class IncomeControllerMvcTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @MockBean
    private lateinit var mockIncomeDao: IncomeDao

    @MockBean
    private lateinit var mockIncomeSourceDao: IncomeSourceDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    @Throws(Exception::class)
    fun `should list`() {
        val income = createIncome(12L)
        person.addIncome(income)

        mvc.perform(get("/api/persons/{personId}/incomes", person.id))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(income.id!!.toInt()))
            .andExpect(jsonPath("$[0].monthlyAmount").value(income.monthlyAmount.toDouble()))
            .andExpect(jsonPath("$[0].source.id").value(income.source.id!!.toInt()))
    }

    @Test
    @Throws(Exception::class)
    fun `should delete`() {
        val income = createIncome(12L)
        person.addIncome(income)

        whenever(mockIncomeDao.findById(income.id!!)).thenReturn(Optional.of(income))

        mvc.perform(delete("/api/persons/{personId}/incomes/{incomeId}", person.id, income.id))
            .andExpect(status().isNoContent)
    }

    @Test
    @Throws(Exception::class)
    fun `should create`() {
        val incomeSource = createIncomeSource(12L)

        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))
        whenever(mockIncomeDao.save(any<Income>()))
            .thenReturnModifiedFirstArgument<Income> { income -> income.id = 345L }

        val command = IncomeCommandDTO(incomeSource.id!!, BigDecimal.TEN)
        mvc.perform(
            post("/api/persons/{personId}/incomes", person.id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(345))
    }
}
