package org.globe42.web.incomes

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.IncomeDao
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Income
import org.globe42.domain.IncomeSource
import org.globe42.domain.IncomeSourceType
import org.globe42.domain.Person
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.Test
import java.math.BigDecimal

/**
 * Unit tests for [IncomeController]
 * @author JB Nizet
 */
class IncomeControllerTest {

    private val mockPersonDao = mockk<PersonDao>()

    private val mockIncomeDao = mockk<IncomeDao>(relaxUnitFun = true)

    private val mockIncomeSourceDao = mockk<IncomeSourceDao>()

    private val controller = IncomeController(mockPersonDao, mockIncomeDao, mockIncomeSourceDao)

    @Test
    fun `should list`() {
        val personId = 42L
        val person = Person(personId)
        val income = createIncome(12L)
        person.addIncome(income)
        every { mockPersonDao.findByIdOrNull(personId) } returns person

        val result = controller.list(personId)

        assertThat(result).hasSize(1)
        assertThat(result[0].id).isEqualTo(income.id)
        assertThat(result[0].source.id).isEqualTo(income.source.id)
        assertThat(result[0].monthlyAmount).isEqualTo(income.monthlyAmount)
    }

    @Test
    fun `should throw if person not found`() {
        val personId = 42L
        every { mockPersonDao.findByIdOrNull(personId) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.list(personId) }
    }

    @Test
    fun `should delete`() {
        val personId = 42L
        val incomeId = 12L
        val income = Income(incomeId)
        income.person = Person(personId)
        every { mockIncomeDao.findByIdOrNull(incomeId) } returns income

        controller.delete(personId, incomeId)

        verify { mockIncomeDao.delete(income) }
    }

    @Test
    fun `should accept deletion if not found to be idempotent`() {
        val incomeId = 12L
        every { mockIncomeDao.findByIdOrNull(incomeId) } returns null

        controller.delete(42L, incomeId)

        verify(inverse = true) { mockIncomeDao.delete(any()) }
    }

    @Test
    fun `should reject deletion if not in correct person`() {
        val incomeId = 12L
        val personId = 42L
        val income = Income(incomeId)
        income.person = Person(personId)

        every { mockIncomeDao.findByIdOrNull(incomeId) } returns income

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.delete(456L, incomeId) }
    }

    @Test
    fun `should create`() {
        val personId = 42L
        val sourceId = 12L

        val person = Person(personId)
        val source = createIncomeSource(sourceId)

        every { mockPersonDao.findByIdOrNull(personId) } returns person
        every { mockIncomeSourceDao.findByIdOrNull(sourceId) } returns source
        every { mockIncomeDao.save(any<Income>()) } answers { arg<Income>(0).apply { id = 34L } }

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
        every { mockPersonDao.findByIdOrNull(personId) } returns person
        every { mockIncomeSourceDao.findByIdOrNull(sourceId) } returns null

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
        every { mockPersonDao.findByIdOrNull(personId) } returns person
        every { mockIncomeSourceDao.findByIdOrNull(sourceId) } returns source

        val command = IncomeCommandDTO(sourceId, BigDecimal.TEN)
        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(personId, command) }
    }

    @Test
    fun `should throw when creating for unknown source`() {
        val personId = 42L
        val sourceId = 12L

        every { mockPersonDao.findByIdOrNull(personId) } returns null

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
