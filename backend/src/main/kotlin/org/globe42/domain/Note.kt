package org.globe42.domain

import java.time.Instant
import javax.persistence.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

private const val NOTE_GENERATOR = "NoteGenerator"

/**
 * A note, allowing to add free information on a person
 * @author JB Nizet
 */
@Entity
class Note {

    @Id
    @SequenceGenerator(name = NOTE_GENERATOR, sequenceName = "NOTE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = NOTE_GENERATOR)
    var id: Long? = null

    @NotEmpty
    lateinit var text: String

    /**
     * The user who created the note.
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    lateinit var creator: User

    @NotNull
    var creationInstant = Instant.now()

    @NotNull
    @Enumerated(EnumType.STRING)
    var category: NoteCategory = NoteCategory.APPOINTMENT

    constructor()

    constructor(id: Long) {
        this.id = id
    }
}
