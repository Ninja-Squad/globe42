package org.globe42.web.incomes

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.never
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.IncomeDao
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Income
import org.globe42.domain.IncomeSource
import org.globe42.domain.IncomeSourceType
import org.globe42.domain.Person
import org.globe42.test.BaseTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import java.math.BigDecimal
import java.util.*

/**
 * Unit tests for [IncomeController]
 * @author JB Nizet
 */
class IncomeControllerTest : BaseTest() {

    @Mock
    private lateinit var mockPersonDao: PersonDao

    @Mock
    private lateinit var mockIncomeDao: IncomeDao

    @Mock
    private lateinit var mockIncomeSourceDao: IncomeSourceDao

    @InjectMocks
    private lateinit var controller: IncomeController

    @Test
    fun `should list`() {
        val personId = 42L
        val person = Person(personId)
        val income = createIncome(12L)
        person.addIncome(income)
        whenever(mockPersonDao.findById(personId)).thenReturn(Optional.of(person))

        val result = controller.list(personId)

        assertThat(result).hasSize(1)
        assertThat(result[0].id).isEqualTo(income.id)
        assertThat(result[0].source.id).isEqualTo(income.source!!.id)
        assertThat(result[0].monthlyAmount).isEqualTo(income.monthlyAmount)
    }

    @Test
    fun `should throw if person not found`() {
        val personId = 42L
        whenever(mockPersonDao.findById(personId)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.list(personId) }
    }

    @Test
    fun `should delete`() {
        val personId = 42L
        val incomeId = 12L
        val income = Income(incomeId)
        income.person = Person(personId)
        whenever(mockIncomeDao.findById(incomeId)).thenReturn(Optional.of(income))

        controller.delete(personId, incomeId)

        verify(mockIncomeDao).delete(income)
    }

    @Test
    fun `should accept deletion if not found to be idempotent`() {
        val incomeId = 12L
        whenever(mockIncomeDao.findById(incomeId)).thenReturn(Optional.empty())

        controller.delete(42L, incomeId)

        verify(mockIncomeDao, never()).delete(any())
    }

    @Test
    fun `should reject deletion if not in correct person`() {
        val incomeId = 12L
        val personId = 42L
        val income = Income(incomeId)
        income.person = Person(personId)

        whenever(mockIncomeDao.findById(incomeId)).thenReturn(Optional.of(income))

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.delete(456L, incomeId) }
    }

    @Test
    fun `should create`() {
        val personId = 42L
        val sourceId = 12L

        val person = Person(personId)
        val source = createIncomeSource(sourceId)

        whenever(mockPersonDao.findById(personId)).thenReturn(Optional.of(person))
        whenever(mockIncomeSourceDao.findById(sourceId)).thenReturn(Optional.of(source))
        whenever(mockIncomeDao.save(any<Income>())).thenReturnModifiedFirstArgument<Income> { it.id = 34L }

        val command = IncomeCommandDTO(sourceId, BigDecimal.TEN)

        val (id, source1, monthlyAmount) = controller.create(personId, command)

        assertThat(id).isEqualTo(34L)
        assertThat(monthlyAmount).isEqualByComparingTo(command.monthlyAmount)
        assertThat(source1.id).isEqualTo(command.sourceId)
    }

    @Test
    fun `should throw when creating for unknown person`() {
        val personId = 42L
        val sourceId = 12L

        val person = Person(personId)
        whenever(mockPersonDao.findById(personId)).thenReturn(Optional.of(person))
        whenever(mockIncomeSourceDao.findById(sourceId)).thenReturn(Optional.empty())

        val command = IncomeCommandDTO(sourceId, BigDecimal.TEN)

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(personId, command) }
    }

    @Test
    fun `should throw when creating with too large amount`() {
        val personId = 42L
        val sourceId = 12L

        val person = Person(personId)
        val source = createIncomeSource(sourceId)
        source.maxMonthlyAmount = BigDecimal("9")
        whenever(mockPersonDao.findById(personId)).thenReturn(Optional.of(person))
        whenever(mockIncomeSourceDao.findById(sourceId)).thenReturn(Optional.of(source))

        val command = IncomeCommandDTO(sourceId, BigDecimal.TEN)
        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(personId, command) }
    }

    @Test
    fun `should throw when creating for unknown source`() {
        val personId = 42L
        val sourceId = 12L

        whenever(mockPersonDao.findById(personId)).thenReturn(Optional.empty())

        val command = IncomeCommandDTO(sourceId, BigDecimal.TEN)

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.create(personId, command) }
    }
}

internal fun createIncome(id: Long): Income {
    val income = Income(id)
    val incomeSource = createIncomeSource(id * 10)
    income.source = incomeSource
    income.monthlyAmount = BigDecimal("123.45")
    return income
}

internal fun createIncomeSource(id: Long): IncomeSource {
    val incomeSource = IncomeSource(id)
    incomeSource.type = IncomeSourceType(id * 10, "CAF")
    incomeSource.name = "CAF ${id}"
    return incomeSource
}