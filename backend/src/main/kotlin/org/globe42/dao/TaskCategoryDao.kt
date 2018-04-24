package org.globe42.dao

import org.globe42.domain.TaskCategory
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for [org.globe42.domain.TaskCategory]
 * @author JB Nizet
 */
interface TaskCategoryDao : JpaRepository<TaskCategory, Long>
