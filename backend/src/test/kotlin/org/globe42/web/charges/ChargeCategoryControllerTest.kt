package org.globe42.web.charges

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.ChargeCategoryDao
import org.globe42.domain.ChargeCategory
import org.junit.jupiter.api.Test
import org.springframework.data.repository.findByIdOrNull

/**
 * Unit tests for [ChargeCategoryController]
 * @author JB Nizet
 */
class ChargeCategoryControllerTest {

    private val mockChargeCategoryDao = mockk<ChargeCategoryDao>()

    private val controller = ChargeCategoryController(mockChargeCategoryDao)

    private val chargeCategory = ChargeCategory(1L, "rental")

    @Test
    fun `should get`() {
        every { mockChargeCategoryDao.findByIdOrNull(chargeCategory.id!!) } returns chargeCategory

        val result = controller.get(chargeCategory.id!!)

        assertThat(result.id).isEqualTo(chargeCategory.id!!)
    }

    @Test
    fun `should list`() {
        every { mockChargeCategoryDao.findAll() } returns listOf(chargeCategory)

        val result = controller.list()

        assertThat(result).hasSize(1)
        assertThat(result[0].id).isEqualTo(1L)
        assertThat(result[0].name).isEqualTo("rental")
    }

    @Test
    fun `should create`() {
        val command = createCommand()

        every { mockChargeCategoryDao.existsByName(command.name) } returns false
        every { mockChargeCategoryDao.save(any<ChargeCategory>()) } answers { arg<ChargeCategory>(0).apply { id = 42 } }

        val result = controller.create(command)

        verify {
            mockChargeCategoryDao.save(withArg<ChargeCategory> {
                assertChargeCategoryEqualsCommand(it, command)
            })
        }

        assertThat(result.id).isEqualTo(42L)
    }

    @Test
    fun `should update`() {
        val command = createCommand()

        every { mockChargeCategoryDao.findByIdOrNull(chargeCategory.id!!) } returns chargeCategory
        every { mockChargeCategoryDao.findByName(command.name) } returns null

        controller.update(chargeCategory.id!!, command)

        assertChargeCategoryEqualsCommand(chargeCategory, command)
    }

    private fun assertChargeCategoryEqualsCommand(source: ChargeCategory, command: ChargeCategoryCommandDTO) {
        assertThat(source.name).isEqualTo(command.name)
    }

    private fun createCommand(): ChargeCategoryCommandDTO = ChargeCategoryCommandDTO("Food")
}
