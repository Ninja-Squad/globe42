package org.globe42.domain

import java.time.LocalDate
import javax.persistence.*

private const val CHILD_GENERATOR = "ChildGenerator"

/**
 * A child of the family of a person
 * @author JB Nizet
 */
@Entity
class Child {
    @Id
    @SequenceGenerator(name = CHILD_GENERATOR, sequenceName = "CHILD_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = CHILD_GENERATOR)
    var id: Long? = null

    var firstName: String? = null

    var birthDate: LocalDate? = null;

    @Enumerated(EnumType.STRING)
    lateinit var location: Location;

    @ManyToOne(fetch = FetchType.LAZY)
    lateinit var family: Family
}
