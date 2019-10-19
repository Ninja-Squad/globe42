package org.globe42.web.charges

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.ChargeCategoryDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.domain.ChargeCategory
import org.globe42.domain.ChargeType
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.util.*

/**
 * Unit tests for [ChargeTypeController]
 * @author JB Nizet
 */
class ChargeTypeControllerTest {
    private val mockChargeTypeDao = mockk<ChargeTypeDao>()
    private val mockChargeCategoryDao = mockk<ChargeCategoryDao>()
    private val controller = ChargeTypeController(mockChargeTypeDao, mockChargeCategoryDao)

    private lateinit var chargeType: ChargeType

    @BeforeEach
    fun prepare() {
        chargeType = ChargeType(42L).apply {
            name = "source 1"
            category = ChargeCategory(1L, "category 1")
            maxMonthlyAmount = BigDecimal("1234.56")
        }
    }

    @Test
    fun `should list`() {
        every { mockChargeTypeDao.findAll() } returns listOf(chargeType)

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
        every { mockChargeTypeDao.findById(chargeTypeId) } returns Optional.of(chargeType)

        val result = controller.get(chargeTypeId)

        assertThat(result.id).isEqualTo(chargeTypeId)
    }

    @Test
    fun `should throw when getting with unknown id`() {
        every { mockChargeTypeDao.findById(chargeType.id!!) } returns Optional.empty()

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(chargeType.id!!) }
    }

    @Test
    fun `should create`() {
        val command = createCommand()

        every { mockChargeTypeDao.existsByName(command.name) } returns false
        every { mockChargeCategoryDao.findById(command.categoryId) } returns
            Optional.of(ChargeCategory(command.categoryId, "category 2"))
        every { mockChargeTypeDao.save(any<ChargeType>()) } returns chargeType

        val result = controller.create(command)

        verify {
            mockChargeTypeDao.save(withArg<ChargeType> {
                assertChargeTypeEqualsCommand(it, command)
            })
        }

        assertThat(result).isNotNull

    }

    @Test
    fun `should throw when creating with unknown charge category`() {
        val command = createCommand()

        every { mockChargeCategoryDao.findById(command.categoryId) } returns
            Optional.of(ChargeCategory(command.categoryId, "category 2"))
        every { mockChargeTypeDao.existsByName(command.name) } returns true

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should throw when creating with existing name`() {
        val command = createCommand()

        every { mockChargeTypeDao.existsByName(command.name) } returns true

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should update`() {
        val command = createCommand()

        every { mockChargeTypeDao.findByName(command.name) } returns Optional.empty()
        every { mockChargeTypeDao.findById(chargeType.id!!) } returns Optional.of(chargeType)
        every { mockChargeCategoryDao.findById(command.categoryId) } returns
            Optional.of(ChargeCategory(command.categoryId, "category 2"))

        controller.update(chargeType.id!!, command)

        assertChargeTypeEqualsCommand(chargeType, command)
    }

    @Test
    fun `should throw if not found when updating`() {
        every { mockChargeTypeDao.findById(chargeType.id!!) } returns Optional.empty()

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(
                chargeType.id!!,
                createCommand()
            )
        }
    }

    @Test
    fun `should throw when updating with already used name`() {
        val command = createCommand()

        every { mockChargeTypeDao.findById(chargeType.id!!) } returns Optional.of(chargeType)
        every { mockChargeCategoryDao.findById(command.categoryId) } returns
            Optional.of(ChargeCategory(command.categoryId, "category 2"))
        every { mockChargeTypeDao.findByName(command.name) } returns Optional.of(ChargeType(4567L))

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy {
            controller.update(chargeType.id!!, command)
        }
    }

    @Test
    fun `should update if same name is kept`() {
        val command = createCommand()

        every { mockChargeTypeDao.findById(chargeType.id!!) } returns Optional.of(chargeType)
        every { mockChargeCategoryDao.findById(command.categoryId) } returns
            Optional.of(ChargeCategory(command.categoryId, "category 2"))
        every { mockChargeTypeDao.findByName(command.name) } returns Optional.of(chargeType)

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
