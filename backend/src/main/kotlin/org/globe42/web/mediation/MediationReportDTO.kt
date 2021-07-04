package org.globe42.web.mediation

import org.globe42.web.countries.CountryDTO
import org.globe42.web.persons.PersonIdentityDTO
import org.globe42.web.users.UserDTO

/**
 * JSON report regarding the mediation appointments, containing various statistics
 * @author JB Nizet
 */
data class MediationReportDTO(
    val appointmentCount: Int,
    val userAppointments: List<UserAppointmentCountDTO>,
    val personAppointments: List<PersonAppointmentCountDTO>,
    val averageAge: Double?,
    val ageRangeAppointments: List<AgeRangeAppointmentCountDTO>,
    val nationalityAppointments: List<NationalityAppointmentCountDTO>,
    val averageIncomeMonthlyAmount: Double?
)

data class UserAppointmentCountDTO(
    val user: UserDTO,
    val count: Int
)

data class PersonAppointmentCountDTO(
    val person: PersonIdentityDTO,
    val count: Int
)

data class AgeRangeAppointmentCountDTO(
    val range: AgeRangeDTO,
    val count: Int
)

data class AgeRangeDTO(
    val fromInclusive: Int?,
    val toExclusive: Int?
) {
    fun accept(age: Double) = fromInclusive?.let { it <= age } ?: true && toExclusive?.let { it > age } ?: true
}

data class NationalityAppointmentCountDTO(
    val nationality: CountryDTO,
    val count: Int
)
