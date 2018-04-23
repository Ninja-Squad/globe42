package org.globe42.web.incomes

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSourceType
import org.globe42.test.BaseTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.InjectMocks
import org.mockito.Mock
import java.util.*

/**
 * Unit tests for [IncomeSourceTypeController]
 * @author JB Nizet
 */
class IncomeSourceTypeControllerTest : BaseTest() {

    @Mock
    private lateinit var mockIncomeSourceTypeDao: IncomeSourceTypeDao

    @InjectMocks
    private lateinit var controller: IncomeSourceTypeController

    @Captor
    private lateinit var incomeSourceTypeArgumentCaptor: ArgumentCaptor<IncomeSourceType>

    private lateinit var incomeSourceType: IncomeSourceType

    @BeforeEach
    fun prepare() {
        incomeSourceType = IncomeSourceType(1L, "CAF")
    }

    @Test
    fun `should get`() {
        whenever(mockIncomeSourceTypeDao.findById(incomeSourceType.id!!)).thenReturn(Optional.of(incomeSourceType))

        val result = controller.get(incomeSourceType.id!!)

        assertThat(result.id).isEqualTo(incomeSourceType.id!!)
    }

    @Test
    fun `should list`() {
        whenever(mockIncomeSourceTypeDao.findAll()).thenReturn(listOf(incomeSourceType))

        val result = controller.list()

        assertThat(result).hasSize(1)
        assertThat(result[0].id).isEqualTo(1L)
        assertThat(result[0].type).isEqualTo("CAF")
    }

    @Test
    fun `should create`() {
        val command = createIncomeSourceTypeCommand()

        whenever(mockIncomeSourceTypeDao.existsByType(command.type)).thenReturn(false)
        whenever(mockIncomeSourceTypeDao.save(any<IncomeSourceType>()))
                .thenReturnModifiedFirstArgument<IncomeSourceType> { it.id = 42L }

        val result = controller.create(command)

        verify(mockIncomeSourceTypeDao).save(incomeSourceTypeArgumentCaptor.capture())

        assertThat(result.id).isEqualTo(42L)
        assertIncomeSourceTypeEqualsCommand(incomeSourceTypeArgumentCaptor.value, command)
    }

    @Test
    fun `should update`() {
        val command = createIncomeSourceTypeCommand()

        whenever(mockIncomeSourceTypeDao.findById(incomeSourceType.id!!)).thenReturn(Optional.of(incomeSourceType))
        whenever(mockIncomeSourceTypeDao.findByType(command.type)).thenReturn(Optional.empty())

        controller.update(incomeSourceType.id!!, command)

        assertIncomeSourceTypeEqualsCommand(incomeSourceType, command)
    }

    private fun assertIncomeSourceTypeEqualsCommand(source: IncomeSourceType, command: IncomeSourceTypeCommandDTO) {
        assertThat(source.type).isEqualTo(command.type)
    }
}

internal fun createIncomeSourceTypeCommand(): IncomeSourceTypeCommandDTO {
    return IncomeSourceTypeCommandDTO("Securité Sociale")
}