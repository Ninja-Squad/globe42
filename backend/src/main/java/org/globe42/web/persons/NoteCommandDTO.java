package org.globe42.web.persons;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Command sent to create a note
 * @author JB Nizet
 */
public final class NoteCommandDTO {
    @NotEmpty
    private final String text;

    @JsonCreator
    public NoteCommandDTO(@JsonProperty("text") String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
