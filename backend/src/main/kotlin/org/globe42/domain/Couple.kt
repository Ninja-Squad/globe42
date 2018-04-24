package org.globe42.domain

import java.util.*
import javax.persistence.*

private const val COUPLE_GENERATOR = "CoupleGenerator"

/**
 * A couple (typically, marriage or PACS) between two persons.
 * This is not designed as a OneToOne association between persons, because the association is optional and needs
 * to be bidirectional. This would either require byte-code enhancements or additional queries to know if the
 * association exists, and this is cumbersome or inefficient because we almost always don't care about this association.
 *
 * Instead, we model this as an entity, and all persons in a couple (i.e. the two persons) have a ManyToOne association
 * with this entity.
 *
 * A couple is immutable: if a person enters in a couple with another person, his/her couple is destroyed and a new one
 * is created. A person can't be in two different couples at the same time.
 *
 * @author JB Nizet
 */
@Entity
class Couple {

    @Id
    @SequenceGenerator(name = COUPLE_GENERATOR, sequenceName = "PERSON_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = COUPLE_GENERATOR)
    private var id: Long? = null

    /**
     * The 2 persons in the couple
     */
    @OneToMany(mappedBy = "couple")
    private val persons: MutableSet<Person> = HashSet()

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(first: Person, second: Person) {
        this.persons.add(first)
        this.persons.add(second)
        first.couple = this
        second.couple = this
    }

    fun getSpouseOf(person: Person): Person {
        if (!this.persons.contains(person)) {
            throw IllegalStateException("The person ${person.id} is not involved in this couple ${this.id}")
        }
        return persons.stream()
                .filter { p -> p != person }
                .findAny()
                .orElseThrow {
                    IllegalStateException("there is no person other than ${person.id} in this couple ${this.id}")
                }
    }
}
