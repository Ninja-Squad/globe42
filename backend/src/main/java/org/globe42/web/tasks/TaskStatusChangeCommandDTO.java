package org.globe42.web.tasks;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.globe42.domain.TaskStatus;

/**
 * Command sent to change the status of a task
 * @author JB Nizet
 */
public final class TaskStatusChangeCommandDTO {
    @NotNull
    private final TaskStatus newStatus;

    @JsonCreator
    public TaskStatusChangeCommandDTO(@JsonProperty("newStatus") TaskStatus newStatus) {
        this.newStatus = newStatus;
    }

    public TaskStatus getNewStatus() {
        return newStatus;
    }
}
