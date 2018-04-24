package org.globe42.web.tasks;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.TaskCategoryDao;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for task categories
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/task-categories")
@Transactional
public class TaskCategoryController {

    private final TaskCategoryDao taskCategoryDao;

    public TaskCategoryController(TaskCategoryDao taskCategoryDao) {
        this.taskCategoryDao = taskCategoryDao;
    }

    @GetMapping
    public List<TaskCategoryDTO> list() {
        return taskCategoryDao.findAll().stream().map(TaskCategoryDTO::new).collect(Collectors.toList());
    }
}
