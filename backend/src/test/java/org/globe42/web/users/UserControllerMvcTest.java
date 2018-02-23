package org.globe42.web.users;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.NoteDao;
import org.globe42.dao.SpentTimeDao;
import org.globe42.dao.TaskDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.GlobeMvcTest;
import org.globe42.web.security.CurrentUser;
import org.globe42.web.security.PasswordDigester;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC test for {@link UserController}
 * @author JB Nizet
 */
@GlobeMvcTest(UserController.class)
public class UserControllerMvcTest {
    @MockBean
    private CurrentUser mockCurrentUser;

    @MockBean
    private UserDao mockUserDao;

    @MockBean
    private TaskDao mockTaskDao;

    @MockBean
    private NoteDao mockNoteDao;

    @MockBean
    private SpentTimeDao mockSpentTimeDao;

    @MockBean
    private PasswordGenerator mockPasswordGenerator;

    @MockBean
    private PasswordDigester mockPasswordDigester;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldGetCurrentUser() throws Exception {
        User user = UserControllerTest.createUser(42L);
        when(mockCurrentUser.getUserId()).thenReturn(user.getId());
        when(mockUserDao.findNotDeletedById(user.getId())).thenReturn(Optional.of(user));

        mvc.perform(get("/api/users/me"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.id").value(user.getId()))
           .andExpect(jsonPath("$.login").value(user.getLogin()))
           .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    public void shouldChangePasswordOfCurrentUser() throws Exception {
        User user = UserControllerTest.createUser(42L);
        when(mockCurrentUser.getUserId()).thenReturn(user.getId());
        when(mockUserDao.findNotDeletedById(user.getId())).thenReturn(Optional.of(user));

        ChangePasswordCommandDTO command = new ChangePasswordCommandDTO("newPassword");

        mvc.perform(put("/api/users/me/passwords")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isNoContent());
    }

    @Test
    public void shouldList() throws Exception {
        User user = UserControllerTest.createUser(42L);
        when(mockUserDao.findNotDeleted()).thenReturn(Collections.singletonList(user));

        mvc.perform(get("/api/users"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(user.getId()))
           .andExpect(jsonPath("$[0].login").value(user.getLogin()))
           .andExpect(jsonPath("$[0].password").doesNotExist());
    }

    @Test
    public void shouldCreate() throws Exception {
        UserCommandDTO command = new UserCommandDTO("test", true);

        when(mockPasswordGenerator.generatePassword()).thenReturn("password");
        when(mockPasswordDigester.hash("password")).thenReturn("hashed");

        mvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.login").value(command.getLogin()))
           .andExpect(jsonPath("$.generatedPassword").value("password"));
    }

    @Test
    public void shouldUpdate() throws Exception {
        User user = UserControllerTest.createUser(42L);
        when(mockUserDao.findNotDeletedById(user.getId())).thenReturn(Optional.of(user));

        UserCommandDTO command = new UserCommandDTO("test", true);

        mvc.perform(put("/api/users/{userId}", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isNoContent());
    }

    @Test
    public void shouldDelete() throws Exception {
        User user = UserControllerTest.createUser(42L);
        when(mockUserDao.findNotDeletedById(user.getId())).thenReturn(Optional.of(user));

        mvc.perform(delete("/api/users/{userId}", user.getId()))
           .andExpect(status().isNoContent());
    }

    @Test
    public void shouldResetPassword() throws Exception {
        User user = UserControllerTest.createUser(42L);
        when(mockUserDao.findNotDeletedById(user.getId())).thenReturn(Optional.of(user));

        when(mockPasswordGenerator.generatePassword()).thenReturn("password");
        when(mockPasswordDigester.hash("password")).thenReturn("hashed");

        mvc.perform(post("/api/users/{userId}/password-resets", user.getId()))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.login").value(user.getLogin()))
           .andExpect(jsonPath("$.generatedPassword").value("password"));
    }
}
