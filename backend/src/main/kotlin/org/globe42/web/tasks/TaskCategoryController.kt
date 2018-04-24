package org.globe42.web.tasks

import org.globe42.dao.TaskCategoryDao
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.transaction.Transactional

/**
 * REST controller for task categories
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/task-categories"])
@Transactional
class TaskCategoryController(private val taskCategoryDao: TaskCategoryDao) {

    @GetMapping
    fun list(): List<TaskCategoryDTO> = taskCategoryDao.findAll().map(::TaskCategoryDTO)
}
