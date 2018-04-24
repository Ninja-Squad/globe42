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
        val email: String?,
        val adherent: Boolean,
        val entryDate: LocalDate?,
        val gender: Gender,
        val phoneNumber: String?,
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
        val healthInsurance: String?,
        val healthInsuranceStartDate: LocalDate?,
        val accompanying: String?,
        val socialSecurityNumber: String?,
        val cafNumber: String?,
        val spouse: PersonIdentityDTO?,
        val nationality: CountryDTO?,
        val frenchFamilySituation: FamilySituationDTO?,
        val abroadFamilySituation: FamilySituationDTO?,
        val deleted: Boolean) {

    constructor(person: Person) : this(
            identity = PersonIdentityDTO(person),
            birthName = person.birthName,
            birthDate = person.birthDate,
            address = person.address,
            city = person.city ?.let(::CityDTO),
            email = person.email,
            adherent = person.adherent,
            entryDate = person.entryDate,
            gender = person.gender!!,
            phoneNumber = person.phoneNumber,
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
            accompanying = person.accompanying,
            socialSecurityNumber = person.socialSecurityNumber,
            cafNumber = person.cafNumber,
            spouse = person.spouse?.let(::PersonIdentityDTO),
            nationality = person.nationality?.let(::CountryDTO),
            frenchFamilySituation = person.frenchFamilySituation?.let(::FamilySituationDTO),
            abroadFamilySituation = person.abroadFamilySituation?.let(::FamilySituationDTO),
            deleted = person.deleted)
}
