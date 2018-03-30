package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.globe42.test.Answers.modifiedFirstArgument;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyChar;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.CountryDao;
import org.globe42.dao.CoupleDao;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Country;
import org.globe42.domain.Couple;
import org.globe42.domain.FamilySituation;
import org.globe42.domain.FiscalStatus;
import org.globe42.domain.Gender;
import org.globe42.domain.HealthCareCoverage;
import org.globe42.domain.Housing;
import org.globe42.domain.MaritalStatus;
import org.globe42.domain.Person;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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

    @Mock
    private CoupleDao mockCoupleDao;

    @Mock
    private CountryDao mockCountryDao;

    @InjectMocks
    private PersonController controller;

    @Captor
    private ArgumentCaptor<Person> personArgumentCaptor;

    @Captor
    private ArgumentCaptor<Couple> coupleArgumentCaptor;

    private Person person;

    @BeforeEach
    public void prepare() {
        person = new Person(1L);
        person.setMediationCode("A2");

        when(mockCountryDao.findById(isNotNull())).thenAnswer(
            invocation -> Optional.of(new Country(invocation.getArgument(0),
                                                  "Country " + invocation.getArgument(0))));
    }

    @Test
    public void shouldList() {
        when(mockPersonDao.findNotDeleted()).thenReturn(Collections.singletonList(person));

        List<PersonIdentityDTO> result = controller.list();

        assertThat(result).extracting(PersonIdentityDTO::getId).containsExactly(1L);
    }

    @Test
    public void shouldListDeleted() {
        when(mockPersonDao.findDeleted()).thenReturn(Collections.singletonList(person));

        List<PersonIdentityDTO> result = controller.listDeleted();

        assertThat(result).extracting(PersonIdentityDTO::getId).containsExactly(1L);
    }

    @Test
    public void shouldGet() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        PersonDTO result = controller.get(person.getId());

        assertThat(result.getIdentity().getId()).isEqualTo(person.getId());
    }

    @Test
    public void shouldThrowIfNotFoundWhenGetting() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.get(person.getId()));
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
        PersonCommandDTO command = createCommand("lacote", false, null);

        when(mockPersonDao.save(any(Person.class))).thenAnswer(modifiedFirstArgument((Person p) -> p.setId(42L)));

        assertThat(controller.create(command).getIdentity().getMediationCode()).isNull();
    }

    @Test
    public void shouldCreateWithSpouse() {
        long spouseId = 200L;
        PersonCommandDTO command = createCommand("Lacote", true, spouseId);

        Person agnes = new Person(spouseId);
        when(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes));
        when(mockPersonDao.save(any(Person.class))).thenAnswer(modifiedFirstArgument((Person p) -> p.setId(42L)));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        PersonDTO result = controller.create(command);

        verify(mockPersonDao).save(personArgumentCaptor.capture());
        verify(mockCoupleDao).save(coupleArgumentCaptor.capture());

        Person savedPerson = personArgumentCaptor.getValue();
        assertPersonEqualsCommand(savedPerson, command);
        assertThat(savedPerson.getSpouse()).isEqualTo(agnes);
        assertThat(agnes.getSpouse()).isEqualTo(savedPerson);
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
    public void shouldUpdateWhenNoNationality() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);
        PersonCommandDTO command = createCommandWithNoNationality();
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

    @Test
    public void shouldUpdateWithSpouseWhenNoSpouseBefore() {
        long spouseId = 200L;
        PersonCommandDTO command = createCommand("Lacote", true, spouseId);

        Person agnes = new Person(spouseId);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        when(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        controller.update(person.getId(), command);

        verify(mockCoupleDao).save(coupleArgumentCaptor.capture());
        assertThat(person.getSpouse()).isEqualTo(agnes);
        assertThat(agnes.getSpouse()).isEqualTo(person);
    }

    @Test
    public void shouldUpdateWithSpouseWhenOtherSpouseBefore() {
        long spouseId = 200L;
        PersonCommandDTO command = createCommand("Lacote", true, spouseId);

        Person previousSpouse = new Person(100L);
        Couple previousCouple = new Couple(person, previousSpouse);
        person.setCouple(previousCouple);

        Person agnes = new Person(spouseId);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        when(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        controller.update(person.getId(), command);

        verify(mockCoupleDao).delete(previousCouple);
        verify(mockCoupleDao).save(coupleArgumentCaptor.capture());
        assertThat(person.getSpouse()).isEqualTo(agnes);
        assertThat(agnes.getSpouse()).isEqualTo(person);
        assertThat(previousSpouse.getSpouse()).isNull();
    }

    @Test
    public void shouldUpdateWithoutSpouseWhenOtherSpouseBefore() {
        PersonCommandDTO command = createCommand("Lacote", true, null);

        Person previousSpouse = new Person(100L);
        Couple previousCouple = new Couple(person, previousSpouse);
        person.setCouple(previousCouple);

        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        controller.update(person.getId(), command);

        verify(mockCoupleDao).delete(previousCouple);
        assertThat(person.getSpouse()).isNull();
        assertThat(previousSpouse.getSpouse()).isNull();
    }

    @Test
    public void shouldDeleteCoupleOfNewSpouse() {
        long spouseId = 200L;
        PersonCommandDTO command = createCommand("Lacote", true, spouseId);

        Person agnes = new Person(spouseId);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        when(mockPersonDao.findById(spouseId)).thenReturn(Optional.of(agnes));
        when(mockPersonDao.nextMediationCode('L')).thenReturn(37);

        Person previousSpouseOfAgnes = new Person(100L);
        Couple previousCoupleOfAgnes = new Couple(person, previousSpouseOfAgnes);

        controller.update(person.getId(), command);

        verify(mockCoupleDao).save(coupleArgumentCaptor.capture());
        assertThat(person.getSpouse()).isEqualTo(agnes);
        assertThat(agnes.getSpouse()).isEqualTo(person);

        assertThat(previousSpouseOfAgnes.getSpouse()).isNull();
        verify(mockCoupleDao).delete(previousCoupleOfAgnes);
    }

    @Test
    public void shouldThrowIfNotFoundWhenUpdating() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(
            () -> controller.update(person.getId(), createCommand()));
    }

    @Test
    public void shouldDelete() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        controller.delete(person.getId());

        assertThat(person.isDeleted()).isTrue();
    }

    @Test
    public void shouldThrowIfNotFoundWhenDeleting() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.delete(person.getId()));
    }

    @Test
    public void shouldResurrect() {
        person.setDeleted(true);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        controller.resurrect(person.getId());

        assertThat(person.isDeleted()).isFalse();
    }

    @Test
    public void shouldThrowIfNotFoundWhenResurrecting() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.resurrect(person.getId()));
    }

    static PersonCommandDTO createCommand() {
        return createCommand("Lacote");
    }

    static PersonCommandDTO createCommandWithNoNationality() {
        return createCommand("Lacote", true, null, null);
    }

    static PersonCommandDTO createCommand(String lastName) {
        return createCommand(lastName, true, null);
    }

    static PersonCommandDTO createCommand(String lastName, boolean mediationEnabled, Long spouseId) {
        return createCommand(lastName, mediationEnabled, spouseId, "FRA");
    }

    static PersonCommandDTO createCommand(String lastName, boolean mediationEnabled, Long spouseId, String nationalityId) {
        return new PersonCommandDTO("Cyril",
                                    lastName,
                                    "Lacote du chateau",
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
                                    LocalDate.of(2017, 12, 01),
                                    MaritalStatus.CONCUBINAGE,
                                    spouseId,
                                    Housing.F3,
                                    70,
                                    "Bruno Mala",
                                    FiscalStatus.TAXABLE,
                                    "0123456789012",
                                    true,
                                    HealthCareCoverage.GENERAL,
                                    LocalDate.of(2016, 1, 1),
                                    "AXA",
                                    LocalDate.of(2017, 1, 1),
                                    "Nadia DURAND",
                                    "277126912340454",
                                    "123765",
                                    nationalityId,
                                    new FamilySituationDTO(false, true, 2),
                                    new FamilySituationDTO(true, false, 0));
    }

    private void assertPersonEqualsCommand(Person person, PersonCommandDTO command) {
        assertThat(person.getFirstName()).isEqualTo(command.getFirstName());
        assertThat(person.getLastName()).isEqualTo(command.getLastName());
        assertThat(person.getBirthName()).isEqualTo(command.getBirthName());
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
        if (command.getSpouseId() == null) {
            assertThat(person.getSpouse()).isNull();
        }
        else {
            assertThat(person.getSpouse().getId()).isEqualTo(command.getSpouseId());
        }
        assertThat(person.getHousing()).isEqualTo(command.getHousing());
        assertThat(person.getHousingSpace()).isEqualTo(command.getHousingSpace());
        assertThat(person.getHostName()).isEqualTo(command.getHostName());
        assertThat(person.getFiscalStatus()).isEqualTo(command.getFiscalStatus());
        assertThat(person.getFiscalNumber()).isEqualTo(command.getFiscalNumber());
        assertThat(person.isFiscalStatusUpToDate()).isEqualTo(command.isFiscalStatusUpToDate());
        assertThat(person.getHealthCareCoverage()).isEqualTo(command.getHealthCareCoverage());
        assertThat(person.getHealthCareCoverageStartDate()).isEqualTo(command.getHealthCareCoverageStartDate());
        assertThat(person.getHealthInsurance()).isEqualTo(command.getHealthInsurance());
        assertThat(person.getHealthInsuranceStartDate()).isEqualTo(command.getHealthInsuranceStartDate());
        assertThat(person.getAccompanying()).isEqualTo(command.getAccompanying());
        assertThat(person.getSocialSecurityNumber()).isEqualTo(command.getSocialSecurityNumber());
        assertThat(person.getCafNumber()).isEqualTo(command.getCafNumber());
        if (command.getNationalityId() == null) {
            assertThat(person.getNationality()).isNull();
        }
        else {
            assertThat(person.getNationality().getId()).isEqualTo(command.getNationalityId());
        }
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
        }
    }
}
