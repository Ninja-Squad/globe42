package org.globe42.web.tasks;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Collections;

import org.globe42.dao.PersonDao;
import org.globe42.dao.TaskDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.Person;
import org.globe42.domain.Task;
import org.globe42.domain.User;
import org.globe42.test.GlobeMvcTest;
import org.globe42.web.security.CurrentUser;
import org.globe42.web.users.UserControllerTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link TaskController}
 * @author JB Nizet
 */
@RunWith(SpringRunner.class)
@GlobeMvcTest(TaskController.class)
public class TaskControllerMvcTest {

    @MockBean
    private TaskDao mockTaskDao;

    @MockBean
    private UserDao mockUserDao;

    @MockBean
    private PersonDao mockPersonDao;

    @MockBean
    private CurrentUser mockCurrentUser;

    @Autowired
    private MockMvc mvc;

    private Task task;

    @Before
    public void prepare() {
        User user = UserControllerTest.createUser(2L);
        task = TaskControllerTest.createTask(23L, user, new Person(45L));
    }

    @Test
    public void shouldListTodos() throws Exception {
        when(mockTaskDao.findTodo()).thenReturn(Collections.singletonList(task));

        mvc.perform(get("/api/tasks"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(task.getId().intValue()))
           .andExpect(jsonPath("$[0].dueDate").value(task.getDueDate().toString()));
    }

    @Test
    public void shouldListTodoBefore() throws Exception {
        when(mockTaskDao.findTodoBefore(LocalDate.of(2017, 8, 1)))
            .thenReturn(Collections.singletonList(task));

        mvc.perform(get("/api/tasks?before=2017-08-01"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(task.getId().intValue()));
    }

    @Test
    public void shouldListUnassigned() throws Exception {
        when(mockTaskDao.findTodoUnassigned())
            .thenReturn(Collections.singletonList(task));

        // the equal is not necessary in production, but is mandatory in tests due to a bug. See
        // https://jira.spring.io/browse/SPR-15831
        mvc.perform(get("/api/tasks?unassigned="))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(task.getId().intValue()));
    }
}
