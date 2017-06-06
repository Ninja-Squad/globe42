package org.globe42.web.users;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.GlobeMvcTest;
import org.globe42.web.security.CurrentUser;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC test for {@link UserController}
 * @author JB Nizet
 */
@RunWith(SpringRunner.class)
@GlobeMvcTest(UserController.class)
public class UserControllerMvcTest {
    @MockBean
    private CurrentUser mockCurrentUser;

    @MockBean
    private UserDao mockUserDao;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldGetCurrentUser() throws Exception {
        User user = UserControllerTest.createUser(42L);
        when(mockCurrentUser.getUserId()).thenReturn(user.getId());
        when(mockUserDao.findById(user.getId())).thenReturn(Optional.of(user));

        mvc.perform(get("/api/users/me"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.id").value(user.getId()))
           .andExpect(jsonPath("$.login").value(user.getLogin()))
           .andExpect(jsonPath("$.password").doesNotExist());
    }
}
