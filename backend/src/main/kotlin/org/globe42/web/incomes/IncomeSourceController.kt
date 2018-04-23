package org.globe42.web.incomes

import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.IncomeSourceTypeDao
import org.globe42.domain.IncomeSource
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
@RequestMapping(value = ["/api/income-sources"])
@Transactional
class IncomeSourceController(
    private val incomeSourceDao: IncomeSourceDao,
    private val incomeSourceTypeDao: IncomeSourceTypeDao
) {

    @GetMapping
    fun list(): List<IncomeSourceDTO> = incomeSourceDao.findAll().map(::IncomeSourceDTO)

    @GetMapping("/{sourceId}")
    fun get(@PathVariable("sourceId") sourceId: Long): IncomeSourceDTO {
        return incomeSourceDao.findById(sourceId)
            .map(::IncomeSourceDTO)
            .orElseThrow { NotFoundException("No income source with ID $sourceId") }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Validated @RequestBody command: IncomeSourceCommandDTO): IncomeSourceDTO {
        if (incomeSourceDao.existsByName(command.name)) {
            throw BadRequestException(ErrorCode.INCOME_SOURCE_NAME_ALREADY_EXISTS)
        }

        val source = IncomeSource()
        copyCommandToSource(command, source)
        return IncomeSourceDTO(incomeSourceDao.save(source))
    }

    @PutMapping("/{sourceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable("sourceId") sourceId: Long, @Validated @RequestBody command: IncomeSourceCommandDTO) {
        val source = incomeSourceDao.findById(sourceId).orElseThrow(::NotFoundException)

        incomeSourceDao.findByName(command.name)
            .filter { other -> other.id != sourceId }
            .ifPresent { _ -> throw BadRequestException(ErrorCode.INCOME_SOURCE_NAME_ALREADY_EXISTS) }

        copyCommandToSource(command, source)
    }

    private fun copyCommandToSource(command: IncomeSourceCommandDTO, source: IncomeSource) {
        source.name = command.name
        source.type = loadIncomeSourceType(command.typeId)
        source.maxMonthlyAmount = command.maxMonthlyAmount
    }

    private fun loadIncomeSourceType(typeId: Long): IncomeSourceType {
        return incomeSourceTypeDao.findById(typeId).orElseThrow(::NotFoundException)
    }
}
