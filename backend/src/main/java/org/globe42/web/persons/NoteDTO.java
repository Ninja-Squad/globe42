package org.globe42.web.persons;

import java.time.Instant;

import org.globe42.domain.Note;
import org.globe42.web.users.UserDTO;

/**
 * Information about a note
 * @author JB Nizet
 */
public final class NoteDTO {
    private final Long id;
    private final String text;
    private final UserDTO creator;
    private final Instant creationInstant;

    public NoteDTO(Note note) {
        this.id = note.getId();
        this.text = note.getText();
        this.creator = note.getCreator() == null ? null : new UserDTO(note.getCreator());
        this.creationInstant = note.getCreationInstant();
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public UserDTO getCreator() {
        return creator;
    }

    public Instant getCreationInstant() {
        return creationInstant;
    }
}
