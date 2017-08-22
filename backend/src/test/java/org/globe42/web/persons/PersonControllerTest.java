package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.globe42.test.Answers.modifiedFirstArgument;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyChar;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.FamilySituation;
import org.globe42.domain.FiscalStatus;
import org.globe42.domain.Gender;
import org.globe42.domain.Housing;
import org.globe42.domain.MaritalStatus;
import org.globe42.domain.HealthCareCoverage;
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
        person.setMediationCode("A2");
    }

    @Test
    public void shouldList() {
        when(mockPersonDao.findAll()).thenReturn(Collections.singletonList(person));

        List<PersonIdentityDTO> result = controller.list();

        assertThat(result).extracting(PersonIdentityDTO::getId).containsExactly(1L);
    }

    @Test
    public void shouldGet() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        PersonDTO result = controller.get(person.getId());

        assertThat(result.getIdentity().getId()).isEqualTo(person.getId());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfNotFoundWhenGetting() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        controller.get(person.getId());
    }

    @Test
    public void shouldCreate() {
        PersonCommandDTO command = createCommand();

        when(mockPersonDao.save(any(Person.class))).thenAnswer(modifiedFirstArgument((Person p) -> p.setId(42L)));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        PersonDTO result = controller.create(command);

        verify(mockPersonDao).save(personArgumentCaptor.capture());
        Person savedPerson = personArgumentCaptor.getValue();
        assertPersonEqualsCommand(savedPerson, command);
        assertThat(result.getIdentity().getMediationCode()).isEqualTo("L37");
    }

    @Test
    public void shouldCreateWithLowercaseLastName() {
        PersonCommandDTO command = createCommand("lacote");

        when(mockPersonDao.save(any(Person.class))).thenAnswer(modifiedFirstArgument((Person p) -> p.setId(42L)));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        assertThat(controller.create(command).getIdentity().getMediationCode()).isEqualTo("L37");
    }

    @Test
    public void shouldCreateWithLastNameStartingWithBizarreLetter() {
        PersonCommandDTO command = createCommand("$foo");

        when(mockPersonDao.save(any(Person.class))).thenAnswer(modifiedFirstArgument((Person p) -> p.setId(42L)));
        when(mockPersonDao.nextMediationCode('Z')).thenReturn(76);

        assertThat(controller.create(command).getIdentity().getMediationCode()).isEqualTo("Z76");
    }

    @Test
    public void shouldNotGenerateMediationCodeIfMediationDisabled() {
        PersonCommandDTO command = createCommand("lacote", false);

        when(mockPersonDao.save(any(Person.class))).thenAnswer(modifiedFirstArgument((Person p) -> p.setId(42L)));

        assertThat(controller.create(command).getIdentity().getMediationCode()).isNull();
    }

    @Test
    public void shouldUpdate() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);
        PersonCommandDTO command = createCommand();
        controller.update(person.getId(), command);

        assertPersonEqualsCommand(person, command);
        assertThat(person.getMediationCode()).isEqualTo("L37");
    }

    @Test
    public void shouldNotUpdateMediationCodeIfLetterStaysTheSame() {
        person.setMediationCode("L42");
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        PersonCommandDTO command = createCommand();

        controller.update(person.getId(), command);

        assertPersonEqualsCommand(person, command);
        assertThat(person.getMediationCode()).isEqualTo("L42");
        verify(mockPersonDao, never()).nextMediationCode(anyChar());
    }

    @Test
    public void shouldCreateMediationCodeIfMediationEnabledAndNotBefore() {
        person.setMediationCode(null);
        person.setMediationEnabled(false);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        PersonCommandDTO command = createCommand();

        controller.update(person.getId(), command);

        assertPersonEqualsCommand(person, command);
        assertThat(person.getMediationCode()).isEqualTo("L37");
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfNotFoundWhenUpdating() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        controller.update(person.getId(), createCommand());
    }

    static PersonCommandDTO createCommand() {
        return createCommand("Lacote");
    }

    static PersonCommandDTO createCommand(String lastName) {
        return createCommand(lastName, true);
    }

    static PersonCommandDTO createCommand(String lastName, boolean mediationEnabled) {
        return new PersonCommandDTO("Cyril",
                                    lastName,
                                    "CEO, Bitch",
                                    LocalDate.of(1977, 9, 12),
                                    "somewhere",
                                    new CityDTO("42000", "Saint-Etienne"),
                                    "cyril@ninja-squad.com",
                                    true,
                                    LocalDate.of(2017, 4, 13),
                                    Gender.MALE,
                                    "01234567",
                                    mediationEnabled,
                                    MaritalStatus.CONCUBINAGE,
                                    Housing.F3,
                                    70,
                                    FiscalStatus.TAXABLE,
                                    LocalDate.of(2017, 2, 1),
                                    true,
                                    HealthCareCoverage.GENERAL,
                                    new FamilySituationDTO(false, true, 2, 3),
                                    new FamilySituationDTO(true, false, 0, 1));
    }

    private void assertPersonEqualsCommand(Person person, PersonCommandDTO command) {
        assertThat(person.getFirstName()).isEqualTo(command.getFirstName());
        assertThat(person.getLastName()).isEqualTo(command.getLastName());
        assertThat(person.getNickName()).isEqualTo(command.getNickName());
        assertThat(person.getBirthDate()).isEqualTo(command.getBirthDate());
        assertThat(person.getAddress()).isEqualTo(command.getAddress());
        assertThat(person.getCity().getCode()).isEqualTo(command.getCity().getCode());
        assertThat(person.getCity().getCity()).isEqualTo(command.getCity().getCity());
        assertThat(person.getEmail()).isEqualTo(command.getEmail());
        assertThat(person.isAdherent()).isEqualTo(command.isAdherent());
        assertThat(person.getEntryDate()).isEqualTo(command.getEntryDate());
        assertThat(person.getGender()).isEqualTo(command.getGender());
        assertThat(person.getPhoneNumber()).isEqualTo(command.getPhoneNumber());
        assertThat(person.getMaritalStatus()).isEqualTo(command.getMaritalStatus());
        assertThat(person.getHousing()).isEqualTo(command.getHousing());
        assertThat(person.getHousingSpace()).isEqualTo(command.getHousingSpace());
        assertThat(person.getFiscalStatus()).isEqualTo(command.getFiscalStatus());
        assertThat(person.getFiscalStatusDate()).isEqualTo(command.getFiscalStatusDate());
        assertThat(person.isFiscalStatusUpToDate()).isEqualTo(command.isFiscalStatusUpToDate());
        assertThat(person.getHealthCareCoverage()).isEqualTo(command.getHealthCareCoverage());
        assertFamilySituationEqualsCommand(person.getFrenchFamilySituation(), command.getFrenchFamilySituation());
        assertFamilySituationEqualsCommand(person.getAbroadFamilySituation(), command.getAbroadFamilySituation());
    }

    private void assertFamilySituationEqualsCommand(FamilySituation familySituation, FamilySituationDTO dto) {
        if (dto == null) {
            assertThat(familySituation).isNull();
        }
        else {
            assertThat(familySituation.isParentsPresent()).isEqualTo(dto.isParentsPresent());
            assertThat(familySituation.isSpousePresent()).isEqualTo(dto.isSpousePresent());
            assertThat(familySituation.getChildCount()).isEqualTo(dto.getChildCount());
            assertThat(familySituation.getSiblingCount()).isEqualTo(dto.getSiblingCount());
        }
    }
}
