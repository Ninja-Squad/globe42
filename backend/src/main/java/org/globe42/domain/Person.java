package org.globe42.domain;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * A person helped by Globe 42. This person is not necessarily a member of the association.
 * @author JB Nizet
 */
@Entity
public class Person {

    private static final String PERSON_GENERATOR = "PersonGenerator";

    @Id
    @SequenceGenerator(name = PERSON_GENERATOR, sequenceName = "PERSON_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = PERSON_GENERATOR)
    private Long id;

    private String firstName;

    @NotEmpty
    private String lastName;

    private String nickName;

    private LocalDate birthDate;

    @NotEmpty
    private String mediationCode;

    private String address;

    @Embedded
    @Valid
    private City city;

    @Email
    private String email;

    private boolean adherent;

    private LocalDate entryDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String phoneNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus = MaritalStatus.UNKNOWN;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Housing housing = Housing.UNKNOWN;

    /**
     * The housing space, in square meters
     */
    private Integer housingSpace;

    @NotNull
    @Enumerated(EnumType.STRING)
    private FiscalStatus fiscalStatus = FiscalStatus.UNKNOWN;

    private LocalDate fiscalStatusDate;

    private boolean fiscalStatusUpToDate;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private FamilySituation frenchFamilySituation;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private FamilySituation abroadFamilySituation;

    /**
     * The incomes of the person
     */
    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Income> incomes = new HashSet<>();

    public Person() {
    }

    public Person(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getMediationCode() {
        return mediationCode;
    }

    public void setMediationCode(String mediationCode) {
        this.mediationCode = mediationCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isAdherent() {
        return adherent;
    }

    public void setAdherent(boolean adherent) {
        this.adherent = adherent;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public Housing getHousing() {
        return housing;
    }

    public void setHousing(Housing housing) {
        this.housing = housing;
    }

    public Integer getHousingSpace() {
        return housingSpace;
    }

    public void setHousingSpace(Integer housingSpace) {
        this.housingSpace = housingSpace;
    }

    public FiscalStatus getFiscalStatus() {
        return fiscalStatus;
    }

    public void setFiscalStatus(FiscalStatus fiscalStatus) {
        this.fiscalStatus = fiscalStatus;
    }

    public LocalDate getFiscalStatusDate() {
        return fiscalStatusDate;
    }

    public void setFiscalStatusDate(LocalDate fiscalStatusDate) {
        this.fiscalStatusDate = fiscalStatusDate;
    }

    public boolean isFiscalStatusUpToDate() {
        return fiscalStatusUpToDate;
    }

    public void setFiscalStatusUpToDate(boolean fiscalStatusUpToDate) {
        this.fiscalStatusUpToDate = fiscalStatusUpToDate;
    }

    public FamilySituation getFrenchFamilySituation() {
        return frenchFamilySituation;
    }

    public void setFrenchFamilySituation(FamilySituation frenchFamilySituation) {
        this.frenchFamilySituation = frenchFamilySituation;
    }

    public FamilySituation getAbroadFamilySituation() {
        return abroadFamilySituation;
    }

    public void setAbroadFamilySituation(FamilySituation abroadFamilySituation) {
        this.abroadFamilySituation = abroadFamilySituation;
    }

    public void addIncome(Income income) {
        income.setPerson(this);
        this.incomes.add(income);
    }

    public void removeIncome(Income income) {
        income.setPerson(null);
        this.incomes.remove(income);
    }

    public Set<Income> getIncomes() {
        return Collections.unmodifiableSet(incomes);
    }
}
