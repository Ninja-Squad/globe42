package org.globe42.domain

import java.time.LocalDate
import java.util.*
import javax.persistence.*
import javax.validation.Valid
import javax.validation.constraints.Email
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull
import javax.validation.constraints.Pattern

const val FISCAL_NUMBER_REGEXP = "\\d{13}|^$"
private const val PERSON_GENERATOR = "PersonGenerator"

/**
 * A person helped by, or member of Globe 42.
 * There are two main kinds of persons. Those for whom mediation is done by Globe 42, and the others.
 * For those who have mediation enabled, a mediation code is generated by the application, and several additional
 * fields are requested about them.
 * @author JB Nizet
 */
@Entity
class Person {

    @Id
    @SequenceGenerator(name = PERSON_GENERATOR, sequenceName = "PERSON_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = PERSON_GENERATOR)
    var id: Long? = null

    /**
     * The first name, requested to all persons, and mandatory
     */
    @NotEmpty
    lateinit var firstName: String

    /**
     * The last name, requested to all persons, and mandatory
     */
    @NotEmpty
    lateinit var lastName: String

    /**
     * The birth name, requested to all persons, but not mandatory.
     * The birth name could be the maiden name of a married woman, for instance
     */
    var birthName: String? = null

    /**
     * The nick name, requested to all persons, but not mandatory
     */
    var nickName: String? = null

    /**
     * The gender of the person, requested to all persons, and mandatory
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    lateinit var gender: Gender

    /**
     * The birth date, requested to all persons, but not mandatory
     */
    var birthDate: LocalDate? = null

    /**
     * Is the person an official member of the association. Requested to all persons, and mandatory.
     */
    var adherent: Boolean = false

    /**
     * The first address line (street and number, typically) of the person. Requested to all persons, but not mandatory
     */
    var address: String? = null

    /**
     * The postal code and city of the person. Requested to all persons, but not mandatory
     */
    @Embedded
    @Valid
    var city: City? = null

    /**
     * The email of the person. Requested to all persons, but not mandatory
     */
    @Email
    var email: String? = null

    /**
     * The phone number of the person. Requested to all persons, but not mandatory
     */
    var phoneNumber: String? = null

    /**
     * Is mediation enabled for the person or not. Requested to all persons, and mandatory.
     */
    var mediationEnabled: Boolean = false

    /**
     * The mediation code, generated automatically for mediation-enabled persons only, from the first letter of the
     * last name, and from a sequence.
     */
    var mediationCode: String? = null

    /**
     * The date of first mediation appointment. Only requested to mediation-enabled persons, but not mandatory
     */
    var firstMediationAppointmentDate: LocalDate? = null

    /**
     * The date of entry in France. Only requested to mediation-enabled persons, but not mandatory
     */
    var entryDate: LocalDate? = null

    /**
     * The marital status. Only requested to mediation-enabled persons, and unknown by default (so, technically
     * mandatory, but can be left as unknown)
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    var maritalStatus = MaritalStatus.UNKNOWN

    /**
     * The couple (marriage, PACS, etc.) in which the person is engaged with another person. Only requested to
     * mediation-enabled persons, and not mandatory. Note that it would make sense to only have a couple if
     * for some marital statuses, but no such check is made for now (in case we would preserve this association
     * for later).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    var couple: Couple? = null

    /**
     * The housing kind. Only requested to mediation-enabled persons, and unknown by default (so, technically
     * mandatory, but can be left as unknown)
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    var housing = Housing.UNKNOWN

    /**
     * The housing space, in square meters. Only requested to mediation-enabled persons, and not mandatory
     */
    var housingSpace: Int? = null

    /**
     * The name of the host, requested to all persons, but not mandatory.
     */
    var hostName: String? = null

    /**
     * The fiscal status. Only requested to mediation-enabled persons, and unknown by default (so, technically
     * mandatory, but can be left as unknown)
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    var fiscalStatus = FiscalStatus.UNKNOWN

    /**
     * The fiscal number. Only requested to mediation-enabled persons, if the fiscal status is not
     * [FiscalStatus.UNKNOWN]. It's composed of 13 digits (see
     * https://cfsmsp.impots.gouv.fr/secavis/faces/commun/aideSpi.jsf)
     */
    @Pattern(regexp = FISCAL_NUMBER_REGEXP)
    var fiscalNumber: String? = null

    /**
     * Is the fiscal status up-to-date. Only requested to mediation-enabled persons, if the fiscal
     * status is not [FiscalStatus.UNKNOWN].
     */
    var fiscalStatusUpToDate: Boolean = false

    /**
     * The family situation of the person in France. Only requested to mediation-enabled persons, and not mandatory
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    var frenchFamilySituation: FamilySituation? = null

    /**
     * The family situation of the person abroad. Only requested to mediation-enabled persons, and not mandatory
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    var abroadFamilySituation: FamilySituation? = null

    /**
     * The incomes of the person. Only requested to mediation-enabled persons
     */
    @OneToMany(mappedBy = "person", cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    private val incomes: MutableSet<Income> = HashSet()

    /**
     * The charges of the person. Only requested to mediation-enabled persons
     */
    @OneToMany(mappedBy = "person", cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    private val charges: MutableSet<Charge> = HashSet()

    /**
     * The per unit revenue information, containing a description of the members of the household needed to compute
     * the per unit revenue
     */
    var perUnitRevenueInformation: PerUnitRevenueInformation? = null

    /**
     * The Health Care Coverage. Only requested to mediation-enabled persons, and unknown by default (so, technically
     * mandatory, but can be left as unknown)
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    var healthCareCoverage = HealthCareCoverage.UNKNOWN

    /**
     * The date when the health care coverage has been established/started. Only requested to mediation-enabled persons,
     * and when the health care coverage is not UNKNOWN
     */
    var healthCareCoverageStartDate: LocalDate? = null

    /**
     * The Health Insurance.  Only requested to mediation-enabled persons, and unknown by default (so, technically
     * mandatory, but can be left as unknown)
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    var healthInsurance = HealthInsurance.UNKNOWN

    /**
     * The date when the health care coverage has been established/started. Only requested to mediation-enabled persons,
     * and when the health insurance is known
     */
    var healthInsuranceStartDate: LocalDate? = null

    /**
     * The name of the accompanying. Only requested to mediation-enabled persons, and not mandatory
     */
    var accompanying: String? = null

    /**
     * The social security number of the person. Only requested to mediation-enabled persons, and not mandatory.
     * In positions 6 and 7 of this number we have the 'place of birth" and we can have letters for people born abroad.
     * So we must have 'String' for the Type of this attribute.
     */
    var socialSecurityNumber: String? = null

    /**
     * The CAF number of the person. CAF = "Caisse Allocations Familiales" in French. Only requested to
     * mediation-enabled persons, and not mandatory
     */
    var cafNumber: String? = null

    /**
     * The nationality of the person. Only requested to mediation-enabled persons, and not mandatory
     */
    @ManyToOne
    var nationality: Country? = null

    /**
     * The notes added on the person
     */
    @OneToMany(cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    @JoinTable(
        name = "person_note",
        joinColumns = [JoinColumn(name = "person_id")],
        inverseJoinColumns = [JoinColumn(name = "note_id")]
    )
    private val notes: MutableSet<Note> = HashSet()

    /**
     * The participations to activity types of the person
     */
    @OneToMany(mappedBy = "person", cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    private val participations: MutableSet<Participation> = HashSet()

    /**
     * The wedding events of the person. Only requested to mediation-enabled persons.
     */
    @OneToMany(mappedBy = "person", cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    private val weddingEvents: MutableSet<WeddingEvent> = HashSet()

    /**
     * Flag indicating that the given person is logically deleted
     */
    var deleted: Boolean = false

    val spouse: Person?
        get() = couple?.getSpouseOf(this)

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(id: Long, firstName: String, lastName: String, gender: Gender) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.gender = gender
    }

    fun addIncome(income: Income) {
        income.person = this
        this.incomes.add(income)
    }

    fun removeIncome(income: Income) {
        this.incomes.remove(income)
    }

    fun getIncomes(): Set<Income> {
        return Collections.unmodifiableSet(incomes)
    }

    fun addCharge(charge: Charge) {
        charge.person = this
        this.charges.add(charge)
    }

    fun removeCharge(charge: Charge) {
        this.charges.remove(charge)
    }

    fun getCharges(): Set<Charge> {
        return Collections.unmodifiableSet(charges)
    }

    fun getNotes(): Set<Note> {
        return Collections.unmodifiableSet(notes)
    }

    fun addNote(note: Note) {
        this.notes.add(note)
    }

    fun removeNote(note: Note) {
        this.notes.remove(note)
    }

    fun getParticipations(): Set<Participation> {
        return Collections.unmodifiableSet(participations)
    }

    fun addParticipation(participation: Participation) {
        participation.person = this
        participations.add(participation)
    }

    fun removeParticipation(participation: Participation) {
        participations.remove(participation)
    }

    fun getWeddingEvents(): Set<WeddingEvent> {
        return Collections.unmodifiableSet(weddingEvents)
    }

    fun addWeddingEvent(weddingEvent: WeddingEvent) {
        weddingEvent.person = this
        weddingEvents.add(weddingEvent)
    }

    fun removeWeddingEvent(weddingEvent: WeddingEvent) {
        weddingEvents.remove(weddingEvent)
    }
}
