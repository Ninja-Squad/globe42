package org.globe42.web.tasks;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Command used to add a spent time on a task
 * @author JB Nizet
 */
public final class SpentTimeCommandDTO {
    private final int minutes;

    @JsonCreator
    public SpentTimeCommandDTO(@JsonProperty("minutes") int minutes) {
        this.minutes = minutes;
    }

    public int getMinutes() {
        return minutes;
    }
}
