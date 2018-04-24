package org.globe42.web.persons

import org.globe42.domain.Note
import org.globe42.web.users.UserDTO
import java.time.Instant

/**
 * Information about a note
 * @author JB Nizet
 */
data class NoteDTO(
        val id: Long,
        val text: String,
        val creator: UserDTO,
        val creationInstant: Instant) {

    constructor(note: Note) : this(
            note.id!!,
            note.text!!,
            UserDTO(note.creator!!),
            note.creationInstant!!)
}
