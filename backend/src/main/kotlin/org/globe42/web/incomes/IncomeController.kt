package org.globe42.web.incomes

import org.globe42.dao.IncomeDao
import org.globe42.dao.IncomeSourceDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Income
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * REST controller used to list, create and delete incomes of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/incomes"])
@Transactional
class IncomeController(private val personDao: PersonDao,
                       private val incomeDao: IncomeDao,
                       private val incomeSourceDao: IncomeSourceDao) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long): List<IncomeDTO> {
        val person = loadPerson(personId)
        return person.getIncomes().map(::IncomeDTO)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@PathVariable("personId") personId: Long, @Validated @RequestBody command: IncomeCommandDTO): IncomeDTO {
        val person = loadPerson(personId)

        val source = incomeSourceDao.findById(command.sourceId).orElseThrow {
            BadRequestException("No source with ID ${command.sourceId}")
        }

        source.maxMonthlyAmount?.let {
            if (command.monthlyAmount > it) {
                throw BadRequestException("The monthly amount shouldn't be bigger than ${it}")
            }
        }

        val income = Income()
        income.source = source
        income.monthlyAmount = command.monthlyAmount
        income.person = person

        return IncomeDTO(incomeDao.save(income))
    }

    @DeleteMapping("/{incomeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("personId") personId: Long, @PathVariable("incomeId") incomeId: Long) {
        incomeDao.findById(incomeId).ifPresent { income ->
            if (income.person!!.id != personId) {
                throw NotFoundException("Income with ID $incomeId does not belong to person $personId")
            }
            incomeDao.delete(income)
        }
    }

    private fun loadPerson(id: Long) = personDao.findById(id).orElseThrow { NotFoundException("No person with ID $id") }
}
