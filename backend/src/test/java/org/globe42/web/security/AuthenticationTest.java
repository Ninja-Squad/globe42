package org.globe42.web.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.globe42.dao.CoupleDao;
import org.globe42.dao.PersonDao;
import org.globe42.dao.UserDao;
import org.globe42.web.persons.PersonController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Test for the integration of the authentication filter in the application
 * @author JB Nizet
 */
@ExtendWith(SpringExtension.class)
@WebMvcTest({PersonController.class, AuthenticationConfig.class})
public class AuthenticationTest {
    @MockBean
    private PersonDao mockPersonDao;

    @MockBean
    private CoupleDao mockCoupleDao;

    @MockBean
    private UserDao mockUserDao;

    @MockBean
    private JwtHelper mockJwtHelper;

    @MockBean
    private CurrentUser mockCurrentUser;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldGetUnauthorizedError() throws Exception {
        mvc.perform(get("/api/persons"))
           .andExpect(status().isUnauthorized());
    }
}
