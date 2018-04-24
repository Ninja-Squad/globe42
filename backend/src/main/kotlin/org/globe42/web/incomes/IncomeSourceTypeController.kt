package org.globe42.web.incomes

import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSourceType
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.ErrorCode
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * REST controller used to deal with the CRUD of income sources.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/income-source-types"])
@Transactional
class IncomeSourceTypeController(private val incomeSourceTypeDao: IncomeSourceTypeDao) {

    @GetMapping
    fun list(): List<IncomeSourceTypeDTO> = incomeSourceTypeDao.findAll().map(::IncomeSourceTypeDTO)

    @GetMapping("/{typeId}")
    fun get(@PathVariable("typeId") typeId: Long): IncomeSourceTypeDTO {
        return incomeSourceTypeDao.findById(typeId)
                .map(::IncomeSourceTypeDTO)
                .orElseThrow { NotFoundException("No income source type with ID $typeId") }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Validated @RequestBody command: IncomeSourceTypeCommandDTO): IncomeSourceTypeDTO {
        if (incomeSourceTypeDao.existsByType(command.type)) {
            throw BadRequestException(ErrorCode.INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS)
        }

        val type = IncomeSourceType()
        copyCommandToType(command, type)
        return IncomeSourceTypeDTO(incomeSourceTypeDao.save(type))
    }

    @PutMapping("/{typeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("typeId") typeId: Long, @Validated @RequestBody command: IncomeSourceTypeCommandDTO) {
        val type = incomeSourceTypeDao.findById(typeId).orElseThrow(::NotFoundException)

        incomeSourceTypeDao.findByType(command.type)
                .filter { other -> other.id != typeId }
                .ifPresent { _ -> throw BadRequestException(ErrorCode.INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS) }

        copyCommandToType(command, type)
    }

    private fun copyCommandToType(command: IncomeSourceTypeCommandDTO, type: IncomeSourceType) {
        type.type = command.type
    }
}
