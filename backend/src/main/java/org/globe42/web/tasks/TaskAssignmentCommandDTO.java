package org.globe42.web.tasks;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Command sent to assign a task to a user
 * @author JB Nizet
 */
public final class TaskAssignmentCommandDTO {
    @NotNull
    private final Long userId;

    @JsonCreator
    public TaskAssignmentCommandDTO(@JsonProperty("userId") Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }
}
