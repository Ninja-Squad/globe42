package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Gender;
import org.globe42.domain.Person;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for PersonController
 * @author JB Nizet
 */
public class PersonControllerTest extends BaseTest {

    @Mock
    private PersonDao mockPersonDao;

    @InjectMocks
    private PersonController controller;

    @Captor
    private ArgumentCaptor<Person> personArgumentCaptor;

    private Person person;

    @Before
    public void prepare() {
        person = new Person(1L);
    }

    @Test
    public void shouldList() {
        when(mockPersonDao.findAll()).thenReturn(Collections.singletonList(person));

        List<PersonDTO> result = controller.list();

        assertThat(result).extracting(PersonDTO::getId).containsExactly(1L);
    }

    @Test
    public void shouldGet() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        PersonDTO result = controller.get(person.getId());

        assertThat(result.getId()).isEqualTo(person.getId());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfNotFoundWhenGetting() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        controller.get(person.getId());
    }

    @Test
    public void shouldCreate() {
        PersonCommandDTO command = createCommand();

        when(mockPersonDao.save(any(Person.class))).thenReturn(person);

        controller.create(command);

        verify(mockPersonDao).save(personArgumentCaptor.capture());
        assertPersonEqualsCommand(personArgumentCaptor.getValue(), command);
    }

    @Test
    public void shouldUpdate() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        PersonCommandDTO command = createCommand();
        controller.update(person.getId(), command);

        assertPersonEqualsCommand(person, command);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfNotFoundWhenUpdating() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        controller.update(person.getId(), createCommand());
    }

    static PersonCommandDTO createCommand() {
        return new PersonCommandDTO("Cyril",
                                    "Lacote",
                                    "CEO, Bitch",
                                    LocalDate.of(1977, 9, 12),
                                    "4321",
                                    "somewhere",
                                    new CityDTO("42000", "Saint-Etienne"),
                                    "cyril@ninja-squad.com",
                                    true,
                                    LocalDate.of(2017, 4, 13),
                                    Gender.MALE,
                                    "01234567");
    }

    private void assertPersonEqualsCommand(Person person, PersonCommandDTO command) {
        assertThat(person.getFirstName()).isEqualTo(command.getFirstName());
        assertThat(person.getLastName()).isEqualTo(command.getLastName());
        assertThat(person.getNickName()).isEqualTo(command.getNickName());
        assertThat(person.getBirthDate()).isEqualTo(command.getBirthDate());
        assertThat(person.getMediationCode()).isEqualTo(command.getMediationCode());
        assertThat(person.getAddress()).isEqualTo(command.getAddress());
        assertThat(person.getCity().getCode()).isEqualTo(command.getCity().getCode());
        assertThat(person.getCity().getCity()).isEqualTo(command.getCity().getCity());
        assertThat(person.getEmail()).isEqualTo(command.getEmail());
        assertThat(person.isAdherent()).isEqualTo(command.isAdherent());
        assertThat(person.getEntryDate()).isEqualTo(command.getEntryDate());
        assertThat(person.getGender()).isEqualTo(command.getGender());
        assertThat(person.getPhoneNumber()).isEqualTo(command.getPhoneNumber());
    }
}
