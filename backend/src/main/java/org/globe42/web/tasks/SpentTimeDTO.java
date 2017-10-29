package org.globe42.web.tasks;

import java.time.Instant;

import org.globe42.domain.SpentTime;
import org.globe42.web.users.UserDTO;

/**
 * DTO for a {@link SpentTime}
 * @author JB Nizet
 */
public final class SpentTimeDTO {
    private final Long id;
    private final int minutes;
    private final UserDTO creator;
    private final Instant creationInstant;

    public SpentTimeDTO(SpentTime spentTime) {
        this.id = spentTime.getId();
        this.minutes = spentTime.getMinutes();
        this.creator = spentTime.getCreator() == null ? null : new UserDTO(spentTime.getCreator());
        this.creationInstant = spentTime.getCreationInstant();
    }

    public Long getId() {
        return id;
    }

    public int getMinutes() {
        return minutes;
    }

    public UserDTO getCreator() {
        return creator;
    }

    public Instant getCreationInstant() {
        return creationInstant;
    }
}
