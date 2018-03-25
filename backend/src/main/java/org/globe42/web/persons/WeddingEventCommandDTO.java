package org.globe42.web.persons;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.globe42.domain.WeddingEventType;

/**
 * Command sent to create a wedding event
 * @author JB Nizet
 */
public final class WeddingEventCommandDTO {
    private final LocalDate date;
    private final WeddingEventType type;

    @JsonCreator
    public WeddingEventCommandDTO(@JsonProperty LocalDate date,
                                  @JsonProperty WeddingEventType type) {
        this.date = date;
        this.type = type;
    }

    public LocalDate getDate() {
        return date;
    }

    public WeddingEventType getType() {
        return type;
    }
}
