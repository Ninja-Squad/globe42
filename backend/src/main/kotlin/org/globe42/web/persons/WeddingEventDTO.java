package org.globe42.web.persons;

import java.time.LocalDate;

import org.globe42.domain.WeddingEvent;
import org.globe42.domain.WeddingEventType;

/**
 * DTO for {@link org.globe42.domain.WeddingEvent}
 * @author JB Nizet
 */
public final class WeddingEventDTO {
    private final Long id;
    private final LocalDate date;
    private final WeddingEventType type;

    public WeddingEventDTO(WeddingEvent event) {
        this.id = event.getId();
        this.date = event.getDate();
        this.type = event.getType();
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public WeddingEventType getType() {
        return type;
    }
}
