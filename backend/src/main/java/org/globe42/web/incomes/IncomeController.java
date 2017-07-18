package org.globe42.web.incomes;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.IncomeDao;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.web.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to list, create and delete incomes of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/persons/{personId}/incomes")
@Transactional
public class IncomeController {

    private final PersonDao personDao;
    private final IncomeDao incomeDao;

    public IncomeController(PersonDao personDao, IncomeDao incomeDao) {
        this.personDao = personDao;
        this.incomeDao = incomeDao;
    }

    @GetMapping
    public List<IncomeDTO> list(@PathVariable("personId") Long personId) {
        Person person = loadPerson(personId);
        return person.getIncomes().stream().map(IncomeDTO::new).collect(Collectors.toList());
    }

    @DeleteMapping("/{incomeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("personId") Long personId, @PathVariable("incomeId") Long incomeId) {
        incomeDao.findById(incomeId).ifPresent(income -> {
            if (!income.getPerson().getId().equals(personId)) {
                throw new NotFoundException("Income with ID " + incomeId + " does not belong to person " + personId);
            }
            incomeDao.delete(income);
        });
    }

    private Person loadPerson(Long id) {
        return personDao.findById(id).orElseThrow(() -> new NotFoundException("No person with ID " + id));
    }
}
