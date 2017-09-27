package org.globe42.web.charges;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.ChargeDao;
import org.globe42.dao.ChargeTypeDao;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Charge;
import org.globe42.domain.ChargeType;
import org.globe42.domain.Person;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to list, create and delete charges of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/persons/{personId}/charges")
@Transactional
public class ChargeController {

    private final PersonDao personDao;
    private final ChargeDao chargeDao;
    private final ChargeTypeDao chargeTypeDao;

    public ChargeController(PersonDao personDao, ChargeDao chargeDao, ChargeTypeDao chargeTypeDao) {
        this.personDao = personDao;
        this.chargeDao = chargeDao;
        this.chargeTypeDao = chargeTypeDao;
    }

    @GetMapping
    public List<ChargeDTO> list(@PathVariable("personId") Long personId) {
        Person person = loadPerson(personId);
        return person.getCharges().stream().map(ChargeDTO::new).collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChargeDTO create(@PathVariable("personId") Long personId, @Validated @RequestBody ChargeCommandDTO command) {
        Person person = loadPerson(personId);

        ChargeType type = chargeTypeDao.findById(command.getTypeId()).orElseThrow(
            () -> new BadRequestException("No charge type with ID " + command.getTypeId()));

        if (type.getMaxMonthlyAmount() != null && command.getMonthlyAmount().compareTo(type.getMaxMonthlyAmount()) > 0) {
            throw new BadRequestException("The monthly amount shouldn't be bigger than " + type.getMaxMonthlyAmount());
        }

        Charge charge = new Charge();
        charge.setType(type);
        charge.setMonthlyAmount(command.getMonthlyAmount());
        charge.setPerson(person);

        return new ChargeDTO(chargeDao.save(charge));
    }

    @DeleteMapping("/{chargeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("personId") Long personId, @PathVariable("chargeId") Long chargeId) {
        chargeDao.findById(chargeId).ifPresent(charge -> {
            if (!charge.getPerson().getId().equals(personId)) {
                throw new NotFoundException("Charge with ID " + chargeId + " does not belong to person " + personId);
            }
            chargeDao.delete(charge);
        });
    }

    private Person loadPerson(Long id) {
        return personDao.findById(id).orElseThrow(() -> new NotFoundException("No person with ID " + id));
    }
}
