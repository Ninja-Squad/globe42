package org.globe42.web.tasks;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.PersonDao;
import org.globe42.dao.TaskDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.Person;
import org.globe42.domain.Task;
import org.globe42.domain.TaskStatus;
import org.globe42.domain.User;
import org.globe42.test.GlobeMvcTest;
import org.globe42.web.security.CurrentUser;
import org.globe42.web.users.UserControllerTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
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

    @Autowired
    private ObjectMapper objectMapper;

    private Task task;
    private User user;

    @Before
    public void prepare() {
        user = UserControllerTest.createUser(2L);
        task = TaskControllerTest.createTask(23L, user, new Person(45L));
    }

    @Test
    public void shouldListTodos() throws Exception {
        when(mockTaskDao.findTodo(any())).thenReturn(singlePage(Collections.singletonList(task)));

        mvc.perform(get("/api/tasks"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content.[0].id").value(task.getId().intValue()))
           .andExpect(jsonPath("$.content.[0].dueDate").value(task.getDueDate().toString()));
    }

    @Test
    public void shouldListTodoBefore() throws Exception {
        when(mockTaskDao.findTodoBefore(eq(LocalDate.of(2017, 8, 1)), any()))
            .thenReturn(singlePage(Collections.singletonList(task)));

        mvc.perform(get("/api/tasks?before=2017-08-01"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content[0].id").value(task.getId().intValue()));
    }

    @Test
    public void shouldListUnassigned() throws Exception {
        when(mockTaskDao.findTodoUnassigned(any()))
            .thenReturn(singlePage(Collections.singletonList(task)));

        // the equal is not necessary in production, but is mandatory in tests due to a bug. See
        // https://jira.spring.io/browse/SPR-15831
        mvc.perform(get("/api/tasks?unassigned="))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content[0].id").value(task.getId().intValue()));
    }

    @Test
    public void shouldAssign() throws Exception {
        when(mockTaskDao.findById(task.getId())).thenReturn(Optional.of(task));
        User otherUser = new User(5433L);
        when(mockUserDao.findById(otherUser.getId())).thenReturn(Optional.of(otherUser));

        mvc.perform(post("/api/tasks/{taskId}/assignments", task.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(new TaskAssignmentCommandDTO(otherUser.getId()))))
           .andExpect(status().isCreated());

        assertThat(task.getAssignee()).isEqualTo(otherUser);
    }

    @Test
    public void shouldChangeStatus() throws Exception {
        when(mockTaskDao.findById(task.getId())).thenReturn(Optional.of(task));

        mvc.perform(post("/api/tasks/{taskId}/status-changes", task.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(new TaskStatusChangeCommandDTO(TaskStatus.DONE))))
           .andExpect(status().isCreated());

        assertThat(task.getStatus()).isEqualTo(TaskStatus.DONE);
    }

    private Page<Task> singlePage(List<Task> tasks) {
        return new PageImpl<>(tasks, PageRequest.of(0, TaskController.PAGE_SIZE), tasks.size());
    }
}
