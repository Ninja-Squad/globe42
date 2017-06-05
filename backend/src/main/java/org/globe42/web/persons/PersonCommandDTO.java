package org.globe42.web.persons;

import java.time.LocalDate;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.globe42.domain.Gender;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Command sent to create or update a person
 * @author JB Nizet
 */
public final class PersonCommandDTO {
    private final String firstName;
    private final String lastName;

    @NotEmpty
    private final String surName;

    private final LocalDate birthDate;
    private final String mediationCode;
    private final String address;

    @Valid
    private final CityDTO city;
    private final String email;
    @JsonProperty("isAdherent")
    private final boolean adherent;
    private final LocalDate entryDate;

    @NotNull
    private final Gender gender;
    private final String phoneNumber;

    @JsonCreator
    public PersonCommandDTO(@JsonProperty String firstName,
                            @JsonProperty String lastName,
                            @JsonProperty String surName,
                            @JsonProperty LocalDate birthDate,
                            @JsonProperty String mediationCode,
                            @JsonProperty String address,
                            @JsonProperty CityDTO city,
                            @JsonProperty String email,
                            @JsonProperty("isAdherent") boolean adherent,
                            @JsonProperty LocalDate entryDate,
                            @JsonProperty Gender gender,
                            @JsonProperty String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.surName = surName;
        this.birthDate = birthDate;
        this.mediationCode = mediationCode;
        this.address = address;
        this.city = city;
        this.email = email;
        this.adherent = adherent;
        this.entryDate = entryDate;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getSurName() {
        return surName;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getMediationCode() {
        return mediationCode;
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
}
