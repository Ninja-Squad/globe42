package org.globe42.web.incomes

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSource
import org.globe42.domain.IncomeSourceType
import org.globe42.test.BaseTest
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.InjectMocks
import org.mockito.Mock
import java.math.BigDecimal
import java.util.*

/**
 * Unit tests for [IncomeSourceController]
 * @author JB Nizet
 */
class IncomeSourceControllerTest : BaseTest() {
    @Mock
    private lateinit var mockIncomeSourceDao: IncomeSourceDao

    @Mock
    private lateinit var mockIncomeSourceTypeDao: IncomeSourceTypeDao

    @InjectMocks
    private lateinit var controller: IncomeSourceController

    @Captor
    private lateinit var incomeSourceArgumentCaptor: ArgumentCaptor<IncomeSource>

    private lateinit var incomeSource: IncomeSource

    @BeforeEach
    fun prepare() {
        incomeSource = IncomeSource(42L)
        incomeSource.name = "source 1"
        incomeSource.type = IncomeSourceType(1L, "type 1")
        incomeSource.maxMonthlyAmount = BigDecimal("1234.56")
    }

    @Test
    fun shouldList() {
        whenever(mockIncomeSourceDao.findAll()).thenReturn(listOf(incomeSource))

        val result = controller.list()

        assertThat(result).hasSize(1)
        val (id, name, type, maxMonthlyAmount) = result[0]
        assertThat(id).isEqualTo(incomeSource.id)
        assertThat(name).isEqualTo(incomeSource.name)
        assertThat(type.id).isEqualTo(incomeSource.type!!.id)
        assertThat(type.type).isEqualTo(incomeSource.type!!.type)
        assertThat(maxMonthlyAmount).isEqualTo(incomeSource.maxMonthlyAmount)
        assertThat(id).isEqualTo(incomeSource.id)
    }

    @Test
    fun shouldGet() {
        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))

        val result = controller.get(incomeSource.id!!)

        assertThat(result.id).isEqualTo(incomeSource.id!!)
    }

    @Test
    fun shouldThrowWhenGettingWithUnknownId() {
        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(incomeSource.id!!) }
    }

    @Test
    fun shouldCreate() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceTypeDao.findById(command.typeId))
                .thenReturn(Optional.of(IncomeSourceType(command.typeId, "type 2")))
        whenever(mockIncomeSourceDao.save(any<IncomeSource>())).thenReturn(incomeSource)

        val result = controller.create(command)

        verify(mockIncomeSourceDao).save(incomeSourceArgumentCaptor.capture())

        assertThat(result).isNotNull()
        assertIncomeSourceEqualsCommand(incomeSourceArgumentCaptor.value, command)
    }

    @Test
    fun shouldThrowWhenCreatingWithUnknownIncomeSourceType() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceTypeDao.findById(command.typeId))
                .thenReturn(Optional.of(IncomeSourceType(command.typeId, "type 2")))
        whenever(mockIncomeSourceDao.existsByName(command.name)).thenReturn(true)

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun shouldThrowWhenCreatingWithExistingName() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceTypeDao.findById(command.typeId)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun shouldUpdate() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))
        whenever(mockIncomeSourceTypeDao.findById(command.typeId))
                .thenReturn(Optional.of(IncomeSourceType(command.typeId, "type 2")))

        controller.update(incomeSource.id!!, command)

        assertIncomeSourceEqualsCommand(incomeSource, command)
    }

    @Test
    fun shouldThrowIfNotFoundWhenUpdating() {
        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(incomeSource.id!!, createIncomeSourceCommand())
        }
    }

    @Test
    fun shouldThrowWhenUpdatingWithAlreadyUsedNickName() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))
        whenever(mockIncomeSourceTypeDao.findById(command.typeId))
                .thenReturn(Optional.of(IncomeSourceType(command.typeId, "type 2")))
        whenever(mockIncomeSourceDao.findByName(command.name)).thenReturn(Optional.of(IncomeSource(4567L)))

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy {
            controller.update(incomeSource.id!!, command)
        }
    }

    @Test
    fun shouldUpdateIfSameSurnameIsKept() {
        val command = createIncomeSourceCommand()

        whenever(mockIncomeSourceDao.findById(incomeSource.id!!)).thenReturn(Optional.of(incomeSource))
        whenever(mockIncomeSourceTypeDao.findById(command.typeId))
                .thenReturn(Optional.of(IncomeSourceType(command.typeId, "type 2")))
        whenever(mockIncomeSourceDao.findByName(command.name)).thenReturn(Optional.of(incomeSource))

        controller.update(incomeSource.id!!, command)

        assertIncomeSourceEqualsCommand(incomeSource, command)
    }

    private fun assertIncomeSourceEqualsCommand(source: IncomeSource, command: IncomeSourceCommandDTO) {
        assertThat(source.name).isEqualTo(command.name)
        assertThat(source.type!!.id).isEqualTo(command.typeId)
        assertThat(source.maxMonthlyAmount).isEqualTo(command.maxMonthlyAmount)
    }
}

internal fun createIncomeSourceCommand() = IncomeSourceCommandDTO("source 2", 2L, BigDecimal("12.34"))
