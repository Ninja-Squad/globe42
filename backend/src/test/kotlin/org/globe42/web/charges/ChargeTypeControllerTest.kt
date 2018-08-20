package org.globe42.web.charges

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.verify
import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.ChargeCategoryDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.domain.ChargeCategory
import org.globe42.domain.ChargeType
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
 * Unit tests for [ChargeTypeController]
 * @author JB Nizet
 */
class ChargeTypeControllerTest : BaseTest() {
    @Mock
    private lateinit var mockChargeTypeDao: ChargeTypeDao

    @Mock
    private lateinit var mockChargeCategoryDao: ChargeCategoryDao

    @InjectMocks
    private lateinit var controller: ChargeTypeController

    @Captor
    private lateinit var chargeTypeArgumentCaptor: ArgumentCaptor<ChargeType>

    private lateinit var chargeType: ChargeType

    @BeforeEach
    fun prepare() {
        chargeType = ChargeType(42L)
        chargeType.name = "source 1"
        chargeType.category = ChargeCategory(1L, "category 1")
        chargeType.maxMonthlyAmount = BigDecimal("1234.56")
    }

    @Test
    fun `should list`() {
        whenever(mockChargeTypeDao.findAll()).thenReturn(listOf<ChargeType>(chargeType))

        val result = controller.list()

        assertThat(result).hasSize(1)
        val (id, name, category, maxMonthlyAmount) = result[0]
        assertThat(id).isEqualTo(chargeType.id)
        assertThat(name).isEqualTo(chargeType.name)
        assertThat(category.id).isEqualTo(chargeType.category.id)
        assertThat(category.name).isEqualTo(chargeType.category.name)
        assertThat(maxMonthlyAmount).isEqualTo(chargeType.maxMonthlyAmount)
        assertThat(id).isEqualTo(chargeType.id)
    }

    @Test
    fun `should get`() {
        val chargeTypeId = chargeType.id!!
        whenever(mockChargeTypeDao.findById(chargeTypeId)).thenReturn(Optional.of(chargeType))

        val result = controller.get(chargeTypeId)

        assertThat(result.id).isEqualTo(chargeTypeId)
    }

    @Test
    fun `should throw when getting with unknown id`() {
        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(chargeType.id!!) }
    }

    @Test
    fun `should create`() {
        val command = createCommand()

        whenever(mockChargeCategoryDao.findById(command.categoryId))
            .thenReturn(Optional.of(ChargeCategory(command.categoryId, "category 2")))
        whenever(mockChargeTypeDao.save(any<ChargeType>())).thenReturn(chargeType)

        val result = controller.create(command)

        verify(mockChargeTypeDao).save(chargeTypeArgumentCaptor.capture())

        assertThat(result).isNotNull()
        assertChargeTypeEqualsCommand(chargeTypeArgumentCaptor.value, command)
    }

    @Test
    fun `should throw when creating with unknown charge category`() {
        val command = createCommand()

        whenever(mockChargeCategoryDao.findById(command.categoryId))
            .thenReturn(Optional.of(ChargeCategory(command.categoryId, "category 2")))
        whenever(mockChargeTypeDao.existsByName(command.name)).thenReturn(true)

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should throw when creating with existing name`() {
        val command = createCommand()

        whenever(mockChargeCategoryDao.findById(command.categoryId)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should update`() {
        val command = createCommand()

        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.of(chargeType))
        whenever(mockChargeCategoryDao.findById(command.categoryId))
            .thenReturn(Optional.of(ChargeCategory(command.categoryId, "category 2")))

        controller.update(chargeType.id!!, command)

        assertChargeTypeEqualsCommand(chargeType, command)
    }

    @Test
    fun `should throw if not found when updating`() {
        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(
                chargeType.id!!,
                createCommand()
            )
        }
    }

    @Test
    fun `should throw when updating with already used nick name`() {
        val command = createCommand()

        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.of(chargeType))
        whenever(mockChargeCategoryDao.findById(command.categoryId))
            .thenReturn(Optional.of(ChargeCategory(command.categoryId, "category 2")))
        whenever(mockChargeTypeDao.findByName(command.name)).thenReturn(Optional.of(ChargeType(4567L)))

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy {
            controller.update(chargeType.id!!, command)
        }
    }

    @Test
    fun `should update if same surname is kept`() {
        val command = createCommand()

        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.of(chargeType))
        whenever(mockChargeCategoryDao.findById(command.categoryId))
            .thenReturn(Optional.of(ChargeCategory(command.categoryId, "category 2")))
        whenever(mockChargeTypeDao.findByName(command.name)).thenReturn(Optional.of(chargeType))

        controller.update(chargeType.id!!, command)

        assertChargeTypeEqualsCommand(chargeType, command)
    }

    private fun assertChargeTypeEqualsCommand(source: ChargeType, command: ChargeTypeCommandDTO) {
        assertThat(source.name).isEqualTo(command.name)
        assertThat(source.category.id!!).isEqualTo(command.categoryId)
        assertThat(source.maxMonthlyAmount).isEqualTo(command.maxMonthlyAmount)
    }
}

internal fun createCommand(): ChargeTypeCommandDTO {
    return ChargeTypeCommandDTO("source 2", 2L, BigDecimal("12.34"))
}
