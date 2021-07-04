package org.globe42.web.mediation

import org.globe42.dao.NoteDao
import org.globe42.domain.Note
import org.globe42.domain.PARIS_TIME_ZONE
import org.globe42.domain.Person
import org.globe42.web.countries.CountryDTO
import org.globe42.web.persons.PersonIdentityDTO
import org.globe42.web.users.UserDTO
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import javax.transaction.Transactional

private val DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy")

/**
 * A controller used to generate a report with statistics about mediation appointments
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/mediation-statistics"])
@Transactional
class MediationStatisticsController(private val noteDao: NoteDao) {

    @GetMapping
    fun get(@RequestParam from: LocalDate, @RequestParam to: LocalDate): MediationReportDTO {
        val fromInclusive = from.atStartOfDay(PARIS_TIME_ZONE).toInstant()
        val toExclusive = to.plusDays(1).atStartOfDay(PARIS_TIME_ZONE).toInstant()
        val appointmentsWithPerson = noteDao.findBetweenWithPerson(fromInclusive, toExclusive)
        val appointments = appointmentsWithPerson.map { it.first }

        val appointmentCount = appointments.size
        val userAppointments = getUserAppointments(appointments)
        val personAppointments = getPersonAppointments(appointmentsWithPerson)
        val averageAge = getAverageAge(fromInclusive, toExclusive, appointmentsWithPerson)
        val ageRangeAppointments = getAgeRangeAppointments(appointmentsWithPerson)
        val nationalityAppointments = getNationalityAppointments(appointmentsWithPerson)
        val averageIncomeMonthlyAmount = getAverageMonthlyAmount(appointmentsWithPerson)

        return MediationReportDTO(
            appointmentCount = appointmentCount,
            userAppointments = userAppointments,
            personAppointments = personAppointments,
            averageAge = averageAge,
            ageRangeAppointments = ageRangeAppointments,
            nationalityAppointments = nationalityAppointments,
            averageIncomeMonthlyAmount = averageIncomeMonthlyAmount
        )
    }

    private fun getAverageMonthlyAmount(appointmentsWithPerson: List<Pair<Note, Person>>) =
        appointmentsWithPerson
            .asSequence()
            .map { (_, person) -> person }
            .distinct()
            .filter { it.getIncomes().isNotEmpty() } // TODO check that this is correct
            .map { person -> person.getIncomes().sumOf { it.monthlyAmount.toDouble() } }
            .average()
            .takeUnless { it.isNaN() }

    private fun getNationalityAppointments(appointmentsWithPerson: List<Pair<Note, Person>>) =
        appointmentsWithPerson
            .asSequence()
            .filter { (_, person) -> person.nationality != null }
            .groupBy({ (_, person) -> person.nationality })
            .map { (country, notesWithPerson) -> NationalityAppointmentCountDTO(CountryDTO(country!!), notesWithPerson.size) }
            .sortedBy { it.nationality.name }

    private fun getAgeRangeAppointments(appointmentsWithPerson: List<Pair<Note, Person>>): List<AgeRangeAppointmentCountDTO> {
        val ageRanges = listOf(AgeRangeDTO(null, 60), AgeRangeDTO(60, 80), AgeRangeDTO(80, null))
        val appointmentCountByAgeRange =
            ageRanges.associateWith { 0 }.toMutableMap()
        appointmentsWithPerson.forEach { (appointment, person) ->
            person.birthDate?.let { birthDate ->
                val age = computeAge(birthDate, appointment.creationInstant.atZone(PARIS_TIME_ZONE).toLocalDate())
                val ageRange = ageRanges.find { it.accept(age) }
                ageRange?.let { appointmentCountByAgeRange.put(it, 1 + appointmentCountByAgeRange[it]!!) }
            }
        }
        val ageRangeAppointments =
            ageRanges.map { ageRange -> AgeRangeAppointmentCountDTO(ageRange, appointmentCountByAgeRange[ageRange]!!) }
        return ageRangeAppointments
    }

    private fun getAverageAge(
        fromInclusive: Instant,
        toExclusive: Instant,
        appointmentsWithPerson: List<Pair<Note, Person>>
    ): Double? {
        // TODO unclear what to do for the average age:
        // Tu me demandes l'age moyen des personnes reçues en RDV médiation (i.e. qui ont fait l'objet d'au moins une note de type
        // Rendez-vous) sur une période donnée. Est-ce l'age moyen des personnes, ou l'age moyen des rendez-vous. Je m'explique par
        // un exemple: supposons que, sur la période, il y ait eu 3 RDV:
        //
        // - JB: 45 ans
        // - Cédric: 35 ans
        // - JB: 45 ans
        //
        // Est-ce que je compte JB une seule fois, et donc l'age moyen est (45 + 35) / 2 = 40 ans, ou bien est-ce que je compte JB
        // deux fois, et donc l'age moyen est (45 + 45 + 35) / 3 = 41,7 ans?
        //
        // Et par ailleurs, si je ne compte chaque personne qu'une fois, comment est-ce que je calcule son age?
        // S'agit-il de son age au début de la période concernée, à la fin de la période concernée, ou au moment où le
        // rapport est demandé?
        val referenceDate =
            Instant.ofEpochMilli(fromInclusive.toEpochMilli() + ((toExclusive.toEpochMilli() - fromInclusive.toEpochMilli()) / 2))
                .atZone(PARIS_TIME_ZONE)
                .toLocalDate()
        val averageAge =
            appointmentsWithPerson
                .asSequence()
                .map { (_, person) -> person }
                .distinct()
                .map { it.birthDate }
                .filterNotNull()
                .map { birthDate -> computeAge(birthDate, referenceDate) }
                .average()
                .takeUnless { it.isNaN() }
        return averageAge
    }

    private fun getPersonAppointments(appointmentsWithPerson: List<Pair<Note, Person>>) =
        appointmentsWithPerson
            .asSequence()
            .groupBy({ (_, person) -> person })
            .map { (person, notesWithPerson) -> PersonAppointmentCountDTO(PersonIdentityDTO(person), notesWithPerson.size) }
            .sortedWith(compareBy({ it.person.firstName }, { it.person.lastName }))

    private fun getUserAppointments(appointments: List<Note>) = appointments
        .asSequence()
        .groupBy { it.creator }
        .map { (user, appointments) -> UserAppointmentCountDTO(UserDTO(user), appointments.size) }
        .sortedBy { it.user.login }

    private fun computeAge(birthDate: LocalDate, referenceDate: LocalDate): Double {
        val entireYears = ChronoUnit.YEARS.between(birthDate, referenceDate)
        val remainingDays = ChronoUnit.DAYS.between(birthDate.plusYears(entireYears), referenceDate)
        val partialYear = remainingDays / 365.0
        return entireYears + partialYear
    }
}
