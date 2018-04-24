package org.globe42.web.tasks;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.PersonDao;
import org.globe42.dao.TaskCategoryDao;
import org.globe42.dao.TaskDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.Person;
import org.globe42.domain.Task;
import org.globe42.domain.TaskCategory;
import org.globe42.domain.TaskStatus;
import org.globe42.domain.User;
import org.globe42.test.Answers;
import org.globe42.test.GlobeMvcTest;
import org.globe42.web.security.CurrentUser;
import org.globe42.web.users.UserControllerTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link TaskController}
 * @author JB Nizet
 */
@GlobeMvcTest(TaskController.class)
public class TaskControllerMvcTest {

    @MockBean
    private TaskDao mockTaskDao;

    @MockBean
    private UserDao mockUserDao;

    @MockBean
    private TaskCategoryDao mockTaskCategoryDao;

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

    @BeforeEach
    public void prepare() {
        TaskCategory variousCategory = new TaskCategory(TaskControllerTest.VARIOUS_CATEGORY_ID, "Various");
        when(mockTaskCategoryDao.findById(variousCategory.getId())).thenReturn(Optional.of(variousCategory));

        user = UserControllerTest.createUser(2L);
        task = TaskControllerTest.createTask(23L, user, new Person(45L), variousCategory);
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
    public void shouldListTodoForPerson() throws Exception {
        Person person = new Person(1L);
        when(mockPersonDao.getOne(1L)).thenReturn(person);
        when(mockTaskDao.findTodoByConcernedPerson(eq(person), any()))
            .thenReturn(singlePage(Collections.singletonList(task)));

        mvc.perform(get("/api/tasks?person=1"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content[0].id").value(task.getId().intValue()));
    }

    @Test
    public void shouldListArchivedForPerson() throws Exception {
        Person person = new Person(1L);
        when(mockPersonDao.getOne(1L)).thenReturn(person);
        when(mockTaskDao.findArchivedByConcernedPerson(eq(person), any()))
            .thenReturn(singlePage(Collections.singletonList(task)));

        mvc.perform(get("/api/tasks?person=1&archived"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content[0].id").value(task.getId().intValue()));
    }

    @Test
    public void shouldListUnassigned() throws Exception {
        when(mockTaskDao.findTodoUnassigned(any()))
            .thenReturn(singlePage(Collections.singletonList(task)));

        mvc.perform(get("/api/tasks?unassigned"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content[0].id").value(task.getId().intValue()));
    }

    @Test
    public void shouldAssign() throws Exception {
        when(mockTaskDao.findById(task.getId())).thenReturn(Optional.of(task));
        User otherUser = new User(5433L);
        when(mockUserDao.findNotDeletedById(otherUser.getId())).thenReturn(Optional.of(otherUser));

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

    @Test
    public void shouldCreate() throws Exception {
        TaskCommandDTO command = TaskControllerTest.createCommand(null, null);

        when(mockTaskDao.save(any(Task.class))).thenAnswer(Answers.<Task>modifiedFirstArgument(task -> task.setId(42L)));

        mvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(42));
    }

    @Test
    public void shouldUpdate() throws Exception {
        TaskCommandDTO command = TaskControllerTest.createCommand(null, null);
        when(mockTaskDao.findById(task.getId())).thenReturn(Optional.of(task));

        mvc.perform(put("/api/tasks/{id}", task.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isNoContent());
    }

    private Page<Task> singlePage(List<Task> tasks) {
        return new PageImpl<>(tasks, PageRequest.of(0, TaskController.PAGE_SIZE), tasks.size());
    }
}
