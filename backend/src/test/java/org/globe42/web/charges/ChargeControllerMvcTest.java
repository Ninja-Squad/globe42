package org.globe42.web.charges;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.ChargeDao;
import org.globe42.dao.ChargeTypeDao;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Charge;
import org.globe42.domain.ChargeType;
import org.globe42.domain.Person;
import org.globe42.test.Answers;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link ChargeController}
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeController.class)
public class ChargeControllerMvcTest {
    @MockBean
    private PersonDao mockPersonDao;

    @MockBean
    private ChargeDao mockChargeDao;

    @MockBean
    private ChargeTypeDao mockChargeTypeDao;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Person person;

    @BeforeEach
    public void prepare() {
        person = new Person(42L);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
    }

    @Test
    public void shouldList() throws Exception {
        Charge charge = ChargeControllerTest.createCharge(12L);
        person.addCharge(charge);

        mvc.perform(get("/api/persons/{personId}/charges", person.getId()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(charge.getId()))
           .andExpect(jsonPath("$[0].monthlyAmount").value(charge.getMonthlyAmount().doubleValue()))
           .andExpect(jsonPath("$[0].type.id").value(charge.getType().getId().intValue()));
    }

    @Test
    public void shouldDelete() throws Exception {
        Charge charge = ChargeControllerTest.createCharge(12L);
        person.addCharge(charge);

        when(mockChargeDao.findById(charge.getId())).thenReturn(Optional.of(charge));

        mvc.perform(delete("/api/persons/{personId}/charges/{chargeId}", person.getId(), charge.getId()))
           .andExpect(status().isNoContent());
    }

    @Test
    public void shouldCreate() throws Exception {
        ChargeType chargeType = ChargeControllerTest.createChargeType(12L);

        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.of(chargeType));
        when(mockChargeDao.save(any(Charge.class)))
            .thenAnswer(Answers.<Charge>modifiedFirstArgument(charge -> charge.setId(345L)));

        ChargeCommandDTO command = new ChargeCommandDTO(chargeType.getId(), BigDecimal.TEN);
        mvc.perform(post("/api/persons/{personId}/charges", person.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(345));
    }
}
