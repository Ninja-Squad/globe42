package org.globe42.domain

import java.time.Instant
import javax.persistence.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

private const val NOTE_GENERATOR = "NoteGenerator"

/**
 * A note, allowing to add free information on a person (or other future entities)
 * @author JB Nizet
 */
@Entity
class Note {

    @Id
    @SequenceGenerator(name = NOTE_GENERATOR, sequenceName = "NOTE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = NOTE_GENERATOR)
    var id: Long? = null

    @NotEmpty
    var text: String? = null

    /**
     * The user who created the task.
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    var creator: User? = null

    var creationInstant: Instant? = null

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
