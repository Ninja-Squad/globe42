package org.globe42.web.tasks;

import java.time.LocalDate;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Command used to create or edit a task
 * @author JB Nizet
 */
public final class TaskCommandDTO {
    @NotEmpty
    private final String title;

    @NotEmpty
    private final String description;

    @NotNull
    private Long categoryId;

    private final LocalDate dueDate;

    private final Long concernedPersonId;

    private final Long assigneeId;

    @JsonCreator
    public TaskCommandDTO(@JsonProperty("title") String title,
                          @JsonProperty("description") String description,
                          @JsonProperty("categoryId") Long categoryId,
                          @JsonProperty("dueDate") LocalDate dueDate,
                          @JsonProperty("concernedPersonId") Long concernedPersonId,
                          @JsonProperty("assigneeId") Long assigneeId) {
        this.title = title;
        this.description = description;
        this.categoryId = categoryId;
        this.dueDate = dueDate;
        this.concernedPersonId = concernedPersonId;
        this.assigneeId = assigneeId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Long getConcernedPersonId() {
        return concernedPersonId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }
}
