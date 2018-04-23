package org.globe42.web.charges

import org.globe42.dao.ChargeCategoryDao
import org.globe42.domain.ChargeCategory
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.ErrorCode
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * REST controller used to deal with the CRUD of charge categories.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/charge-categories"])
@Transactional
class ChargeCategoryController(private val chargeCategoryDao: ChargeCategoryDao) {

    @GetMapping
    fun list(): List<ChargeCategoryDTO> {
        return chargeCategoryDao.findAll().map(::ChargeCategoryDTO)
    }

    @GetMapping("/{categoryId}")
    operator fun get(@PathVariable("categoryId") categoryId: Long): ChargeCategoryDTO {
        return chargeCategoryDao.findById(categoryId)
            .map(::ChargeCategoryDTO)
            .orElseThrow { NotFoundException("No charge category with ID $categoryId") }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Validated @RequestBody command: ChargeCategoryCommandDTO): ChargeCategoryDTO {
        if (chargeCategoryDao.existsByName(command.name)) {
            throw BadRequestException(ErrorCode.CHARGE_CATEGORY_NAME_ALREADY_EXISTS)
        }

        val type = ChargeCategory()
        copyCommandToType(command, type)
        return ChargeCategoryDTO(chargeCategoryDao.save(type))
    }

    @PutMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("categoryId") categoryId: Long, @Validated @RequestBody command: ChargeCategoryCommandDTO) {
        val type = chargeCategoryDao.findById(categoryId).orElseThrow { NotFoundException() }

        chargeCategoryDao.findByName(command.name)
            .filter { other -> other.id != categoryId }
            .ifPresent { _ -> throw BadRequestException(ErrorCode.INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS) }

        copyCommandToType(command, type)
    }

    private fun copyCommandToType(command: ChargeCategoryCommandDTO, type: ChargeCategory) {
        type.name = command.name
    }
}
