package org.globe42.dao;

import org.globe42.domain.TaskCategory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for {@link org.globe42.domain.TaskCategory}
 * @author JB Nizet
 */
public interface TaskCategoryDao extends JpaRepository<TaskCategory, Long> {
}
