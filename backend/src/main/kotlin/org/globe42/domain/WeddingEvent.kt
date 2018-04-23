package org.globe42.domain

import java.time.LocalDate
import javax.persistence.*
import javax.validation.constraints.NotNull
import javax.validation.constraints.Past

private const val WEDDING_EVENT_GENERATOR = "WeddingEventGenerator"

/**
 * A wedding event of a person (wedding or divorce)
 * @author JB Nizet
 */
@Entity
class WeddingEvent {

    @Id
    @SequenceGenerator(
        name = WEDDING_EVENT_GENERATOR,
        sequenceName = "WEDDING_EVENT_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = WEDDING_EVENT_GENERATOR)
    var id: Long? = null

    @Column(name = "event_date")
    @NotNull
    @Past
    var date: LocalDate? = null

    @NotNull
    var type: WeddingEventType? = null

    @ManyToOne
    @NotNull
    var person: Person? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
