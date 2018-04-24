package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotEmpty;

/**
 * A task category. Each task has one. This is basically en enum, but modifiable.
 * @author JB Nizet
 */
@Entity
public class TaskCategory {

    private static final String TASK_CATEGORY_GENERATOR = "TaskCategoryGenerator";

    @Id
    @SequenceGenerator(name = TASK_CATEGORY_GENERATOR, sequenceName = "TASK_CATEGORY_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = TASK_CATEGORY_GENERATOR)
    private Long id;

    @NotEmpty
    private String name;

    public TaskCategory(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public TaskCategory() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
