package org.globe42.web.persons

import org.globe42.domain.*
import java.time.LocalDate
import javax.validation.Valid
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull
import javax.validation.constraints.Pattern

/**
 * Command sent to create or update a person
 * @author JB Nizet
 */
class PersonCommandDTO(
    @field:NotEmpty val firstName: String,
    @field:NotEmpty val lastName: String,
    val birthName: String?,
    val nickName: String?,
    val birthDate: LocalDate?,
    val address: String?,
    @field:Valid val city: CityDTO?,
    val email: String?,
    val entryDate: LocalDate?,
    @field:NotNull val gender: Gender,
    val phoneNumber: String?,
    val mediationEnabled: Boolean,
    val firstMediationAppointmentDate: LocalDate?,
    @field:NotNull val maritalStatus: MaritalStatus = MaritalStatus.UNKNOWN,
    val spouseId: Long?,
    @field:NotNull val housing: Housing = Housing.UNKNOWN,
    val housingSpace: Int?,
    val hostName: String?,
    @field:NotNull val fiscalStatus: FiscalStatus = FiscalStatus.UNKNOWN,
    @field:Pattern(regexp = FISCAL_NUMBER_REGEXP) val fiscalNumber: String?,
    val fiscalStatusUpToDate: Boolean,
    @field:NotNull val healthCareCoverage: HealthCareCoverage = HealthCareCoverage.UNKNOWN,
    val healthCareCoverageStartDate: LocalDate?,
    @field:NotNull val healthInsurance: HealthInsurance = HealthInsurance.UNKNOWN,
    val healthInsuranceStartDate: LocalDate?,
    val accompanying: String?,
    val socialSecurityNumber: String?,
    val cafNumber: String?,
    val nationalityId: String?,
    @field:NotNull val visa: Visa = Visa.UNKNOWN,
    @field:NotNull val residencePermit: ResidencePermit = ResidencePermit.UNKNOWN,
    val residencePermitDepositDate: LocalDate?,
    val residencePermitRenewalDate: LocalDate?
)
