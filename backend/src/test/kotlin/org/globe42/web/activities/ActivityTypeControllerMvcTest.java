package org.globe42.web.activities;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.globe42.dao.PersonDao;
import org.globe42.domain.ActivityType;
import org.globe42.domain.Person;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link ActivityTypeController}
 * @author JB Nizet
 */
@GlobeMvcTest(ActivityTypeController.class)
public class ActivityTypeControllerMvcTest {
    @MockBean
    private PersonDao mockPersonDao;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldListParticipants() throws Exception {
        Person person = new Person(42L);
        person.setEmail("john@doe.com");
        when(mockPersonDao.findParticipants(ActivityType.MEAL)).thenReturn(Arrays.asList(person));

        mvc.perform(get("/api/activity-types/{activityType}/participants", ActivityType.MEAL))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(42))
           .andExpect(jsonPath("$[0].email").value(person.getEmail()));
    }
}
