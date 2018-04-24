package org.globe42.web.tasks;

import org.globe42.domain.TaskCategory;

/**
 * DTO for {@link org.globe42.domain.TaskCategory}
 * @author JB Nizet
 */
public class TaskCategoryDTO {
    private final Long id;
    private final String name;

    public TaskCategoryDTO(TaskCategory category) {
        this.id = category.getId();
        this.name = category.getName();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
