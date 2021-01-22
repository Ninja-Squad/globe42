package org.globe42.domain

import java.time.LocalDate
import java.util.*
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.SequenceGenerator

private const val ACTIVITY_GENERATOR = "ActivityGenerator"

/**
 * An activity, of a given type[ActivityType], an o given day, with participants.
 * The participants of an activity are generall participants of its activity type at the time they're
 * added as participants to the activity, but that is not necessarily true later.
 * For example, John can be a participants of meals in 2019, and so be a participant in the meal activity
 * of June 12 2019, but then become not interested in meals anymore in 2020, but still of course stay a participant
 * of the June 12 2019 activity.
 * @author JB Nizet
 */
@Entity
class Activity {
    @Id
    @SequenceGenerator(name = ACTIVITY_GENERATOR, sequenceName = "ACTIVITY_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = ACTIVITY_GENERATOR)
    var id: Long? = null

    @Enumerated(EnumType.STRING)
    lateinit var type: ActivityType

    lateinit var date: LocalDate

    @ManyToMany
    @JoinTable(
        name = "activity_participant",
        joinColumns = [JoinColumn(name = "activity_id")],
        inverseJoinColumns = [JoinColumn(name = "person_id")]
    )
    private val participants: MutableSet<Person> = HashSet()

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    fun getParticipants(): Set<Person> = participants
    fun addParticipant(person: Person) = participants.add(person)
    fun removeParticipant(person: Person) = participants.remove(person)
    fun setParticipants(persons: Collection<Person>) {
        this.participants.clear()
        this.participants.addAll(persons)
    }
}
