package org.globe42.web.persons

import com.fasterxml.jackson.annotation.JsonUnwrapped
import org.globe42.domain.*
import org.globe42.web.countries.CountryDTO
import java.time.LocalDate

/**
 * DTO for Person
 * @author JB Nizet
 */
data class PersonDTO(
    @field:JsonUnwrapped val identity: PersonIdentityDTO,
    val birthName: String?,
    val birthDate: LocalDate?,
    val address: String?,
    val city: CityDTO?,
    val entryDate: LocalDate?,
    val entryType: EntryType,
    val gender: Gender,
    val mediationEnabled: Boolean,
    val firstMediationAppointmentDate: LocalDate?,
    val maritalStatus: MaritalStatus,
    val housing: Housing,
    val housingSpace: Int?,
    val hostName: String?,
    val fiscalStatus: FiscalStatus,
    val fiscalNumber: String?,
    val fiscalStatusUpToDate: Boolean,
    val healthCareCoverage: HealthCareCoverage,
    val healthCareCoverageStartDate: LocalDate?,
    val healthInsurance: HealthInsurance,
    val healthInsuranceStartDate: LocalDate?,
    val lastHealthCheckDate: LocalDate?,
    val accompanying: String?,
    val socialSecurityNumber: String?,
    val cafNumber: String?,
    val spouse: PersonIdentityDTO?,
    val partner: String?,
    val nationality: CountryDTO?,
    val passportStatus: PassportStatus,
    val passportNumber: String?,
    val passportValidityStartDate: LocalDate?,
    val passportValidityEndDate: LocalDate?,
    val visa: Visa,
    val residencePermit: ResidencePermit,
    val residencePermitDepositDate: LocalDate?,
    val residencePermitRenewalDate: LocalDate?,
    val residencePermitValidityStartDate: LocalDate?,
    val residencePermitValidityEndDate: LocalDate?,
    val schoolLevel: SchoolLevel,
    val deathDate: LocalDate?,
    val deleted: Boolean
) {

    constructor(person: Person) : this(
        identity = PersonIdentityDTO(person),
        birthName = person.birthName,
        birthDate = person.birthDate,
        address = person.address,
        city = person.city?.let(::CityDTO),
        entryDate = person.entryDate,
        entryType = person.entryType,
        gender = person.gender,
        mediationEnabled = person.mediationEnabled,
        firstMediationAppointmentDate = person.firstMediationAppointmentDate,
        maritalStatus = person.maritalStatus,
        housing = person.housing,
        housingSpace = person.housingSpace,
        hostName = person.hostName,
        fiscalStatus = person.fiscalStatus,
        fiscalNumber = person.fiscalNumber,
        fiscalStatusUpToDate = person.fiscalStatusUpToDate,
        healthCareCoverage = person.healthCareCoverage,
        healthCareCoverageStartDate = person.healthCareCoverageStartDate,
        healthInsurance = person.healthInsurance,
        healthInsuranceStartDate = person.healthInsuranceStartDate,
        lastHealthCheckDate = person.lastHealthCheckDate,
        accompanying = person.accompanying,
        socialSecurityNumber = person.socialSecurityNumber,
        cafNumber = person.cafNumber,
        spouse = person.spouse?.let(::PersonIdentityDTO),
        partner = person.partner,
        nationality = person.nationality?.let(::CountryDTO),
        passportStatus = person.passportStatus,
        passportNumber = person.passportNumber,
        passportValidityStartDate = person.passportValidityStartDate,
        passportValidityEndDate = person.passportValidityEndDate,
        visa = person.visa,
        residencePermit = person.residencePermit,
        residencePermitDepositDate = person.residencePermitDepositDate,
        residencePermitRenewalDate = person.residencePermitRenewalDate,
        residencePermitValidityStartDate = person.residencePermitValidityStartDate,
        residencePermitValidityEndDate = person.residencePermitValidityEndDate,
        schoolLevel = person.schoolLevel,
        deathDate = person.deathDate,
        deleted = person.deleted
    )
}
