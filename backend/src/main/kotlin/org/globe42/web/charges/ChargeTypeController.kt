package org.globe42.web.charges

import org.globe42.dao.ChargeCategoryDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.domain.ChargeCategory
import org.globe42.domain.ChargeType
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.ErrorCode
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * REST controller used to deal with the CRUD of charge types.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/charge-types"])
@Transactional
class ChargeTypeController(
    private val chargeTypeDao: ChargeTypeDao,
    private val chargeCategoryDao: ChargeCategoryDao
) {

    @GetMapping
    fun list(): List<ChargeTypeDTO> {
        return chargeTypeDao.findAll().map(::ChargeTypeDTO)
    }

    @GetMapping("/{typeId}")
    operator fun get(@PathVariable("typeId") typeId: Long): ChargeTypeDTO {
        return chargeTypeDao.findById(typeId)
            .map(::ChargeTypeDTO)
            .orElseThrow { NotFoundException("No charge type with ID $typeId") }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Validated @RequestBody command: ChargeTypeCommandDTO): ChargeTypeDTO {
        if (chargeTypeDao.existsByName(command.name)) {
            throw BadRequestException(ErrorCode.INCOME_SOURCE_NAME_ALREADY_EXISTS)
        }

        val source = ChargeType()
        copyCommandToSource(command, source)
        return ChargeTypeDTO(chargeTypeDao.save(source))
    }

    @PutMapping("/{typeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("typeId") typeId: Long, @Validated @RequestBody command: ChargeTypeCommandDTO) {
        val source = chargeTypeDao.findById(typeId).orElseThrow { NotFoundException() }

        chargeTypeDao.findByName(command.name)
            .filter { other -> other.id != typeId }
            .ifPresent { _ -> throw BadRequestException(ErrorCode.CHARGE_TYPE_NAME_ALREADY_EXISTS) }

        copyCommandToSource(command, source)
    }

    private fun copyCommandToSource(command: ChargeTypeCommandDTO, source: ChargeType) {
        source.name = command.name
        source.category = loadChargeCategory(command.categoryId)
        source.maxMonthlyAmount = command.maxMonthlyAmount
    }

    private fun loadChargeCategory(categoryId: Long): ChargeCategory {
        return chargeCategoryDao.findById(categoryId).orElseThrow { NotFoundException() }
    }
}
