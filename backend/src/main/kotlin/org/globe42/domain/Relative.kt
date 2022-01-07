package org.globe42.domain

import java.time.LocalDate
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.SequenceGenerator

private const val RELATIVE_GENERATOR = "RelativeGenerator"

/**
 * A child, brother or sister of a person in its family
 * @author JB Nizet
 */
@Entity
class Relative {
    @Id
    @SequenceGenerator(name = RELATIVE_GENERATOR, sequenceName = "RELATIVE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = RELATIVE_GENERATOR)
    var id: Long? = null

    @Enumerated(EnumType.STRING)
    lateinit var type: RelativeType

    var firstName: String? = null

    var birthDate: LocalDate? = null

    @Enumerated(EnumType.STRING)
    lateinit var location: Location

    @ManyToOne(fetch = FetchType.LAZY)
    lateinit var family: Family
}

enum class RelativeType {
    CHILD,
    BROTHER,
    SISTER
}
