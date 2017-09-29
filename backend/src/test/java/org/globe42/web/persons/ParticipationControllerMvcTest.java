package org.globe42.web.persons;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.PersonDao;
import org.globe42.domain.ActivityType;
import org.globe42.domain.Participation;
import org.globe42.domain.Person;
import org.globe42.test.GlobeMvcTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link ParticipationController}
 * @author JB Nizet
 */
@RunWith(SpringRunner.class)
@GlobeMvcTest(ParticipationController.class)
public class ParticipationControllerMvcTest {
    @MockBean
    private PersonDao mockPersonDao;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Person person;
    private Participation mealParticipation;

    @Before
    public void prepare() {
        person = new Person(42L);
        mealParticipation = new Participation(34L);
        mealParticipation.setActivityType(ActivityType.MEAL);
        person.addParticipation(mealParticipation);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
    }

    @Test
    public void shouldList() throws Exception {
        mvc.perform(get("/api/persons/{personId}/participations", person.getId()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(34));
    }

    @Test
    public void shouldCreate() throws Exception {
        ParticipationCommandDTO command = new ParticipationCommandDTO(ActivityType.SOCIAL_MEDIATION);
        mvc.perform(post("/api/persons/{personId}/participations", person.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.activityType").value(ActivityType.SOCIAL_MEDIATION.name()));
    }

    @Test
    public void shouldDelete() throws Exception {
        mvc.perform(delete("/api/persons/{personId}/participations/{participationId}", person.getId(), mealParticipation.getId()))
           .andExpect(status().isNoContent());
    }
}
