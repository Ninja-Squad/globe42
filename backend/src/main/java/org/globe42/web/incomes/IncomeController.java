package org.globe42.web.incomes;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.web.exception.NotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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

    public IncomeController(PersonDao personDao) {
        this.personDao = personDao;
    }

    @GetMapping
    public List<IncomeDTO> list(@PathVariable("personId") Long personId) {
        Person person = loadPerson(personId);
        return person.getIncomes().stream().map(IncomeDTO::new).collect(Collectors.toList());
    }

    private Person loadPerson(Long id) {
        return personDao.findById(id).orElseThrow(() -> new NotFoundException("No person with ID " + id));
    }
}
