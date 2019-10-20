package org.globe42.web.incomes

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSourceType
import org.junit.jupiter.api.Test

/**
 * Unit tests for [IncomeSourceTypeController]
 * @author JB Nizet
 */
class IncomeSourceTypeControllerTest {

    private val mockIncomeSourceTypeDao = mockk<IncomeSourceTypeDao>()

    private val controller = IncomeSourceTypeController(mockIncomeSourceTypeDao)

    private val incomeSourceType = IncomeSourceType(1L, "CAF")

    @Test
    fun `should get`() {
        every { mockIncomeSourceTypeDao.findByIdOrNull(incomeSourceType.id!!) } returns incomeSourceType

        val result = controller.get(incomeSourceType.id!!)

        assertThat(result.id).isEqualTo(incomeSourceType.id!!)
    }

    @Test
    fun `should list`() {
        every { mockIncomeSourceTypeDao.findAll() } returns listOf(incomeSourceType)

        val result = controller.list()

        assertThat(result).hasSize(1)
        assertThat(result[0].id).isEqualTo(1L)
        assertThat(result[0].type).isEqualTo("CAF")
    }

    @Test
    fun `should create`() {
        val command = createIncomeSourceTypeCommand()

        every { mockIncomeSourceTypeDao.existsByType(command.type) } returns false
        every { mockIncomeSourceTypeDao.save(any<IncomeSourceType>()) } answers { arg<IncomeSourceType>(0).apply { id = 42L } }

        val result = controller.create(command)

        verify {
            mockIncomeSourceTypeDao.save(withArg<IncomeSourceType> {
                assertIncomeSourceTypeEqualsCommand(it, command)
            })
        }

        assertThat(result.id).isEqualTo(42L)
    }

    @Test
    fun `should update`() {
        val command = createIncomeSourceTypeCommand()

        every { mockIncomeSourceTypeDao.findByIdOrNull(incomeSourceType.id!!) } returns incomeSourceType
        every { mockIncomeSourceTypeDao.findByType(command.type) } returns null

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
