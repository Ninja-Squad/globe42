package org.globe42.web.persons;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import org.globe42.domain.FiscalStatus;
import org.globe42.domain.Gender;
import org.globe42.domain.Housing;
import org.globe42.domain.MaritalStatus;
import org.globe42.domain.HealthCareCoverage;
import org.globe42.domain.Person;

/**
 * DTO for Person
 * @author JB Nizet
 */
public final class PersonDTO {
    @JsonUnwrapped
    private final PersonIdentityDTO identity;
    private final LocalDate birthDate;
    private final String address;
    private final CityDTO city;
    private final String email;
    private final boolean adherent;
    private final LocalDate entryDate;
    private final Gender gender;
    private final String phoneNumber;
    private final boolean mediationEnabled;
    private final MaritalStatus maritalStatus;
    private final Housing housing;
    private final Integer housingSpace;
    private final FiscalStatus fiscalStatus;
    private final LocalDate fiscalStatusDate;
    private final boolean fiscalStatusUpToDate;
    private final HealthCareCoverage healthCareCoverage;
    private final FamilySituationDTO frenchFamilySituation;
    private final FamilySituationDTO abroadFamilySituation;


    public PersonDTO(Person person) {
        this.identity = new PersonIdentityDTO(person);
        this.birthDate = person.getBirthDate();
        this.address = person.getAddress();
        this.city = person.getCity() == null ? null : new CityDTO(person.getCity());
        this.email = person.getEmail();
        this.adherent = person.isAdherent();
        this.entryDate = person.getEntryDate();
        this.gender = person.getGender();
        this.phoneNumber = person.getPhoneNumber();
        this.mediationEnabled = person.isMediationEnabled();
        this.maritalStatus = person.getMaritalStatus();
        this.housing = person.getHousing();
        this.housingSpace = person.getHousingSpace();
        this.fiscalStatus = person.getFiscalStatus();
        this.fiscalStatusDate = person.getFiscalStatusDate();
        this.fiscalStatusUpToDate = person.isFiscalStatusUpToDate();
        this.healthCareCoverage = person.getHealthCareCoverage();
        this.frenchFamilySituation = person.getFrenchFamilySituation() == null ? null : new FamilySituationDTO(person.getFrenchFamilySituation());
        this.abroadFamilySituation = person.getAbroadFamilySituation() == null ? null : new FamilySituationDTO(person.getAbroadFamilySituation());

    }

    public PersonIdentityDTO getIdentity() {
        return identity;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getAddress() {
        return address;
    }

    public CityDTO getCity() {
        return city;
    }

    public String getEmail() {
        return email;
    }

    public boolean isAdherent() {
        return adherent;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public Gender getGender() {
        return gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isMediationEnabled() {
        return mediationEnabled;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public Housing getHousing() {
        return housing;
    }

    public Integer getHousingSpace() {
        return housingSpace;
    }

    public FiscalStatus getFiscalStatus() {
        return fiscalStatus;
    }

    public LocalDate getFiscalStatusDate() {
        return fiscalStatusDate;
    }

    public boolean isFiscalStatusUpToDate() {
        return fiscalStatusUpToDate;
    }

    public HealthCareCoverage getHealthCareCoverage() {
        return healthCareCoverage;
    }

    public FamilySituationDTO getFrenchFamilySituation() {
        return frenchFamilySituation;
    }

    public FamilySituationDTO getAbroadFamilySituation() {
        return abroadFamilySituation;
    }
}
