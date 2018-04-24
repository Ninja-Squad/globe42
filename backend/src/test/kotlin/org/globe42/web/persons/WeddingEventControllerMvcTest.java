package org.globe42.web.persons;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.domain.WeddingEvent;
import org.globe42.domain.WeddingEventType;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link WeddingEventController}
 * @author JB Nizet
 */
@GlobeMvcTest(WeddingEventController.class)
public class WeddingEventControllerMvcTest {
    @MockBean
    private PersonDao mockPersonDao;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Person person;
    private WeddingEvent firstWedding;

    @BeforeEach
    public void prepare() {
        person = new Person(42L);
        firstWedding = new WeddingEvent(34L);
        firstWedding.setDate(LocalDate.of(2000, 2, 28));
        firstWedding.setType(WeddingEventType.WEDDING);
        person.addWeddingEvent(firstWedding);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
    }

    @Test
    public void shouldList() throws Exception {
        mvc.perform(get("/api/persons/{personId}/wedding-events", person.getId()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(34))
           .andExpect(jsonPath("$[0].date").value("2000-02-28"))
           .andExpect(jsonPath("$[0].type").value(WeddingEventType.WEDDING.name()));
    }

    @Test
    public void shouldCreate() throws Exception {
        WeddingEventCommandDTO command = new WeddingEventCommandDTO(LocalDate.of(2002, 3, 28),
                                                                    WeddingEventType.DIVORCE);
        mvc.perform(post("/api/persons/{personId}/wedding-events", person.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.type").value(WeddingEventType.DIVORCE.name()));
    }

    @Test
    public void shouldDelete() throws Exception {
        mvc.perform(delete("/api/persons/{personId}/wedding-events/{eventId}", person.getId(), firstWedding.getId()))
           .andExpect(status().isNoContent());
    }
}
