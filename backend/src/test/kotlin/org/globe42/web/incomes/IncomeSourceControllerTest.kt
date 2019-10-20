package org.globe42.web.incomes

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSource
import org.globe42.domain.IncomeSourceType
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal

/**
 * Unit tests for [IncomeSourceController]
 * @author JB Nizet
 */
class IncomeSourceControllerTest {
    private val mockIncomeSourceDao = mockk<IncomeSourceDao>()

    private val mockIncomeSourceTypeDao = mockk<IncomeSourceTypeDao>()

    private val controller = IncomeSourceController(mockIncomeSourceDao, mockIncomeSourceTypeDao)

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

        val result = controller.list()

        assertThat(result).hasSize(1)
        val (id, name, type, maxMonthlyAmount) = result[0]
        assertThat(id).isEqualTo(incomeSource.id)
        assertThat(name).isEqualTo(incomeSource.name)
        assertThat(type.id).isEqualTo(incomeSource.type.id)
        assertThat(type.type).isEqualTo(incomeSource.type.type)
        assertThat(maxMonthlyAmount).isEqualTo(incomeSource.maxMonthlyAmount)
        assertThat(id).isEqualTo(incomeSource.id)
    }

    @Test
    fun `should get`() {
        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns incomeSource

        val result = controller.get(incomeSource.id!!)

        assertThat(result.id).isEqualTo(incomeSource.id!!)
    }

    @Test
    fun `should throw when getting with unknown id`() {
        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(incomeSource.id!!) }
    }

    @Test
    fun `should create`() {
        val command = createIncomeSourceCommand()

        every { mockIncomeSourceDao.existsByName(command.name) } returns false
        every { mockIncomeSourceTypeDao.findByIdOrNull(command.typeId) } returns
            IncomeSourceType(command.typeId, "type 2")
        every { mockIncomeSourceDao.save(any<IncomeSource>()) } returns incomeSource

        val result = controller.create(command)

        verify {
            mockIncomeSourceDao.save(withArg<IncomeSource> {
                assertIncomeSourceEqualsCommand(it, command)
            })
        }

        assertThat(result).isNotNull
    }

    @Test
    fun `should throw when creating with unknown income source type`() {
        val command = createIncomeSourceCommand()

        every { mockIncomeSourceTypeDao.findByIdOrNull(command.typeId) } returns
            IncomeSourceType(command.typeId, "type 2")
        every { mockIncomeSourceDao.existsByName(command.name) } returns true

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should throw when creating with existing name`() {
        val command = createIncomeSourceCommand()

        every { mockIncomeSourceDao.existsByName(command.name) } returns true

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should update`() {
        val command = createIncomeSourceCommand()

        every { mockIncomeSourceDao.findByName(command.name) } returns null
        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns incomeSource
        every { mockIncomeSourceTypeDao.findByIdOrNull(command.typeId) } returns
            IncomeSourceType(command.typeId, "type 2")

        controller.update(incomeSource.id!!, command)

        assertIncomeSourceEqualsCommand(incomeSource, command)
    }

    @Test
    fun `should throw if not found when updating`() {
        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(incomeSource.id!!, createIncomeSourceCommand())
        }
    }

    @Test
    fun `should throw when updating with already used nick name`() {
        val command = createIncomeSourceCommand()

        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns incomeSource
        every { mockIncomeSourceTypeDao.findByIdOrNull(command.typeId) } returns
            IncomeSourceType(command.typeId, "type 2")
        every { mockIncomeSourceDao.findByName(command.name) } returns IncomeSource(4567L)

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy {
            controller.update(incomeSource.id!!, command)
        }
    }

    @Test
    fun `should update if same surname is kept`() {
        val command = createIncomeSourceCommand()

        every { mockIncomeSourceDao.findByIdOrNull(incomeSource.id!!) } returns incomeSource
        every { mockIncomeSourceTypeDao.findByIdOrNull(command.typeId) } returns
            IncomeSourceType(command.typeId, "type 2")
        every { mockIncomeSourceDao.findByName(command.name) } returns incomeSource

        controller.update(incomeSource.id!!, command)

        assertIncomeSourceEqualsCommand(incomeSource, command)
    }

    private fun assertIncomeSourceEqualsCommand(source: IncomeSource, command: IncomeSourceCommandDTO) {
        assertThat(source.name).isEqualTo(command.name)
        assertThat(source.type.id).isEqualTo(command.typeId)
        assertThat(source.maxMonthlyAmount).isEqualTo(command.maxMonthlyAmount)
    }
}

internal fun createIncomeSourceCommand() = IncomeSourceCommandDTO("source 2", 2L, BigDecimal("12.34"))
