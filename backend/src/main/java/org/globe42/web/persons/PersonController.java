package org.globe42.web.persons;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.City;
import org.globe42.domain.FamilySituation;
import org.globe42.domain.Person;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.AdminOnly;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for persons
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/persons")
@Transactional
public class PersonController {

    private final PersonDao personDao;

    public PersonController(PersonDao personDao) {
        this.personDao = personDao;
    }

    @GetMapping
    public List<PersonIdentityDTO> list() {
        return personDao.findAll().stream().map(PersonIdentityDTO::new).collect(Collectors.toList());
    }

    @GetMapping("/{personId}")
    public PersonDTO get(@PathVariable("personId") Long id) {
        return personDao.findById(id).map(PersonDTO::new).orElseThrow(() -> new NotFoundException("No person with ID " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonDTO create(@Validated @RequestBody PersonCommandDTO command) {
        Person person = new Person();
        copyCommandToPerson(command, person);

        if (person.isMediationEnabled()) {
            char mediationCodeLetter = mediationCodeLetter(person);
            person.setMediationCode(mediationCodeLetter + String.valueOf(personDao.nextMediationCode(mediationCodeLetter)));
        }

        return new PersonDTO(personDao.save(person));
    }

    @PutMapping("/{personId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @AdminOnly
    public void update(@PathVariable("personId") Long id, @Validated @RequestBody PersonCommandDTO command) {
        Person person = personDao.findById(id).orElseThrow(() -> new NotFoundException("No person with ID " + id));

        char oldMediationCodeLetter = person.getMediationCode() == null ? 0 : person.getMediationCode().charAt(0);

        copyCommandToPerson(command, person);

        char newMediationCodeLetter = mediationCodeLetter(person);
        // if the mediation code letter changes, we change the code, unless the mediation is disabled,
        // in which case we set it to null.
        // if mediation is disabled and the letter doesn't change, we leave the code there, but
        // we don't transfer it to the client. So if mediation is reenabled, the person will keep the old
        // code.
        if (newMediationCodeLetter != oldMediationCodeLetter) {
            if (command.isMediationEnabled()) {
                person.setMediationCode(newMediationCodeLetter + String.valueOf(personDao.nextMediationCode(
                    newMediationCodeLetter)));
            }
            else {
                person.setMediationCode(null);
            }
        }
    }

    private void copyCommandToPerson(PersonCommandDTO command, Person person) {
        person.setFirstName(command.getFirstName());
        person.setLastName(command.getLastName());
        person.setNickName(command.getNickName());
        person.setBirthDate(command.getBirthDate());
        person.setAddress(command.getAddress());
        if (command.getCity() == null) {
            person.setCity(null);
        }
        else {
            person.setCity(new City(command.getCity().getCode(), command.getCity().getCity()));
        }

        person.setEmail(command.getEmail());
        person.setAdherent(command.isAdherent());
        person.setGender(command.getGender());
        person.setPhoneNumber(command.getPhoneNumber());
        person.setMediationEnabled(command.isMediationEnabled());

        // if mediation is disabled, we leave all the mediation-related elements as is
        // in case mediation is re-enabled later, to not lose valuable information.
        if (command.isMediationEnabled()) {
            person.setEntryDate(command.getEntryDate());
            person.setMaritalStatus(command.getMaritalStatus());
            person.setHousing(command.getHousing());
            person.setHousingSpace(command.getHousingSpace());
            person.setFiscalStatus(command.getFiscalStatus());
            person.setFiscalStatusDate(command.getFiscalStatusDate());
            person.setFiscalStatusUpToDate(command.isFiscalStatusUpToDate());
            person.setHealthCareCoverage(command.getHealthCareCoverage());
            person.setFrenchFamilySituation(toFamilySituation(command.getFrenchFamilySituation()));
            person.setAbroadFamilySituation(toFamilySituation(command.getAbroadFamilySituation()));
        }
    }

    private FamilySituation toFamilySituation(FamilySituationDTO dtoOrNull) {
        if (dtoOrNull == null) {
            return null;
        }
        return new FamilySituation(dtoOrNull.isParentsPresent(),
                                   dtoOrNull.isSpousePresent(),
                                   dtoOrNull.getChildCount(),
                                   dtoOrNull.getSiblingCount());
    }

    private char mediationCodeLetter(Person person) {
        char letter = Character.toUpperCase(person.getLastName().charAt(0));
        if (letter < 'A' || letter > 'Z') {
            letter = 'Z';
        }
        return letter;
    }
}
