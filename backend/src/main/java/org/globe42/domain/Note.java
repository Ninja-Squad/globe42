package org.globe42.domain;

/**
 * A note, allowing to add free information on a person (or other future entities)
 * @author JB Nizet
 */

import java.time.Instant;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotEmpty;

@Entity
public class Note {

    private static final String NOTE_GENERATOR = "NoteGenerator";

    @Id
    @SequenceGenerator(name = NOTE_GENERATOR, sequenceName = "NOTE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = NOTE_GENERATOR)
    private Long id;

    @NotEmpty
    private String text;

    /**
     * The user who created the task. If the user is deleted, the creator will be set to null, to avoid losing tasks.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private User creator;

    private Instant creationInstant;

    public Note() {
    }

    public Note(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Instant getCreationInstant() {
        return creationInstant;
    }

    public void setCreationInstant(Instant creationInstant) {
        this.creationInstant = creationInstant;
    }
}
