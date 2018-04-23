package org.globe42.domain

import javax.persistence.*
import javax.validation.constraints.NotNull

private const val PARTICIPATION_GENERATOR = "ParticipationGenerator"

/**
 * The participation of a person into an activity type. Only one participation can exist for a given
 * person and a given activity type.
 * @author JB Nizet
 */
@Entity
class Participation {

    @Id
    @SequenceGenerator(
        name = PARTICIPATION_GENERATOR,
        sequenceName = "PARTICIPATION_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = PARTICIPATION_GENERATOR)
    var id: Long? = null

    @NotNull
    @Enumerated(EnumType.STRING)
    var activityType: ActivityType? = null

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    var person: Person? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
