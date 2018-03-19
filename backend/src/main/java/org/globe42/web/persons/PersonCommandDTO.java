package org.globe42.web.persons;

import java.time.LocalDate;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.globe42.domain.FiscalStatus;
import org.globe42.domain.Gender;
import org.globe42.domain.HealthCareCoverage;
import org.globe42.domain.Housing;
import org.globe42.domain.MaritalStatus;
import org.globe42.domain.Person;

/**
 * Command sent to create or update a person
 * @author JB Nizet
 */
public final class PersonCommandDTO {
    @NotEmpty
    private final String firstName;

    @NotEmpty
    private final String lastName;
    private final String birthName;
    private final String nickName;

    private final LocalDate birthDate;
    private final String address;

    @Valid
    private final CityDTO city;
    private final String email;
    private final boolean adherent;
    private final LocalDate entryDate;

    @NotNull
    private final Gender gender;
    private final String phoneNumber;
    private final boolean mediationEnabled;
    private final LocalDate firstMediationAppointmentDate;

    @NotNull
    private final MaritalStatus maritalStatus;
    private final Long spouseId;

    @NotNull
    private final Housing housing;
    private final Integer housingSpace;
    private final String hostName;

    @NotNull
    private final FiscalStatus fiscalStatus;

    @Pattern(regexp = Person.FISCAL_NUMBER_REGEXP)
    private final String fiscalNumber;
    private final boolean fiscalStatusUpToDate;
    private final HealthCareCoverage healthCareCoverage;
    private final String healthInsurance;
    private final String accompanying;
    private final String socialSecurityNumber;
    private final String cafNumber;

    private final String nationalityId;

    private final FamilySituationDTO frenchFamilySituation;
    private final FamilySituationDTO abroadFamilySituation;

    @JsonCreator
    public PersonCommandDTO(@JsonProperty String firstName,
                            @JsonProperty String lastName,
                            @JsonProperty String birthName,
                            @JsonProperty String nickName,
                            @JsonProperty LocalDate birthDate,
                            @JsonProperty String address,
                            @JsonProperty CityDTO city,
                            @JsonProperty String email,
                            @JsonProperty boolean adherent,
                            @JsonProperty LocalDate entryDate,
                            @JsonProperty Gender gender,
                            @JsonProperty String phoneNumber,
                            @JsonProperty boolean mediationEnabled,
                            @JsonProperty LocalDate firstMediationAppointmentDate,
                            @JsonProperty MaritalStatus maritalStatus,
                            @JsonProperty Long spouseId,
                            @JsonProperty Housing housing,
                            @JsonProperty Integer housingSpace,
                            @JsonProperty String hostName,
                            @JsonProperty FiscalStatus fiscalStatus,
                            @JsonProperty String fiscalNumber,
                            @JsonProperty boolean fiscalStatusUpToDate,
                            @JsonProperty HealthCareCoverage healthCareCoverage,
                            @JsonProperty String healthInsurance,
                            @JsonProperty String accompanying,
                            @JsonProperty String socialSecurityNumber,
                            @JsonProperty String cafNumber,
                            @JsonProperty String nationalityId,
                            @JsonProperty FamilySituationDTO frenchFamilySituation,
                            @JsonProperty FamilySituationDTO abroadFamilySituation) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthName = birthName;
        this.nickName = nickName;
        this.birthDate = birthDate;
        this.address = address;
        this.city = city;
        this.email = email;
        this.adherent = adherent;
        this.entryDate = entryDate;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.mediationEnabled = mediationEnabled;
        this.firstMediationAppointmentDate = firstMediationAppointmentDate;
        this.maritalStatus = maritalStatus;
        this.spouseId = spouseId;
        this.housing = housing;
        this.housingSpace = housingSpace;
        this.hostName = hostName;
        this.fiscalStatus = fiscalStatus;
        this.fiscalNumber = fiscalNumber;
        this.fiscalStatusUpToDate = fiscalStatusUpToDate;
        this.healthCareCoverage = healthCareCoverage;
        this.healthInsurance = healthInsurance;
        this.accompanying = accompanying;
        this.socialSecurityNumber = socialSecurityNumber;
        this.cafNumber = cafNumber;
        this.nationalityId = nationalityId;
        this.frenchFamilySituation = frenchFamilySituation;
        this.abroadFamilySituation = abroadFamilySituation;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getBirthName() {
        return birthName;
    }

    public String getNickName() {
        return nickName;
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

    public LocalDate getFirstMediationAppointmentDate() {
        return firstMediationAppointmentDate;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public Long getSpouseId() {
        return spouseId;
    }

    public Housing getHousing() {
        return housing;
    }

    public Integer getHousingSpace() {
        return housingSpace;
    }

    public String getHostName() {
        return hostName;
    }

    public FiscalStatus getFiscalStatus() {
        return fiscalStatus;
    }

    public String getFiscalNumber() {
        return fiscalNumber;
    }

    public boolean isFiscalStatusUpToDate() {
        return fiscalStatusUpToDate;
    }

    public HealthCareCoverage getHealthCareCoverage() {
        return healthCareCoverage;
    }

    public String getHealthInsurance() {
        return healthInsurance;
    }

    public String getAccompanying() {
        return accompanying;
    }

    public String getSocialSecurityNumber() {
        return socialSecurityNumber;
    }

    public String getCafNumber() {
        return cafNumber;
    }

    public String getNationalityId() {
        return nationalityId;
    }

    public FamilySituationDTO getFrenchFamilySituation() {
        return frenchFamilySituation;
    }

    public FamilySituationDTO getAbroadFamilySituation() {
        return abroadFamilySituation;
    }
}
