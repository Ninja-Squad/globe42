package org.globe42.web.security;

import static org.globe42.web.security.AuthenticationControllerTest.createCredentials;
import static org.globe42.web.security.AuthenticationControllerTest.createUser;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.test.GlobeMvcTest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Unit tests for AuthenticationController
 * @author JB Nizet
 */
@RunWith(SpringRunner.class)
@GlobeMvcTest(AuthenticationController.class)
public class AuthenticationControllerMvcTest {
    @MockBean
    private UserDao mockUserDao;

    @MockBean
    private PasswordDigester mockPasswordDigester;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtHelper mockJwtHelper;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldAuthenticate() throws Exception {
        CredentialsDTO credentials = createCredentials();

        User user = createUser();
        when(mockUserDao.findByLogin(credentials.getLogin())).thenReturn(Optional.of(user));
        when(mockPasswordDigester.match(credentials.getPassword(), user.getPassword())).thenReturn(true);
        String token = "token";
        when(mockJwtHelper.buildToken(user.getId())).thenReturn(token);

        mvc.perform(post("/api/authentication")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(credentials)))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.login").value(user.getLogin()))
           .andExpect(jsonPath("$.token").value(token));
    }
}
