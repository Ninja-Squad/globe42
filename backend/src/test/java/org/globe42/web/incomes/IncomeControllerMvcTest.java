package org.globe42.web.incomes;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.IncomeDao;
import org.globe42.dao.IncomeSourceDao;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Income;
import org.globe42.domain.IncomeSource;
import org.globe42.domain.Person;
import org.globe42.test.Answers;
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
 * MVC tests for {@link IncomeController}
 * @author JB Nizet
 */
@RunWith(SpringRunner.class)
@GlobeMvcTest(IncomeController.class)
public class IncomeControllerMvcTest {
    @MockBean
    private PersonDao mockPersonDao;

    @MockBean
    private IncomeDao mockIncomeDao;

    @MockBean
    private IncomeSourceDao mockIncomeSourceDao;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Person person;

    @Before
    public void prepare() {
        person = new Person(42L);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
    }

    @Test
    public void shouldList() throws Exception {
        Income income = IncomeControllerTest.createIncome(12L);
        person.addIncome(income);

        mvc.perform(get("/api/persons/{personId}/incomes", person.getId()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(income.getId()))
           .andExpect(jsonPath("$[0].monthlyAmount").value(income.getMonthlyAmount().doubleValue()))
           .andExpect(jsonPath("$[0].source.id").value(income.getSource().getId().intValue()));
    }

    @Test
    public void shouldDelete() throws Exception {
        Income income = IncomeControllerTest.createIncome(12L);
        person.addIncome(income);

        when(mockIncomeDao.findById(income.getId())).thenReturn(Optional.of(income));

        mvc.perform(delete("/api/persons/{personId}/incomes/{incomeId}", person.getId(), income.getId()))
           .andExpect(status().isNoContent());
    }

    @Test
    public void shouldCreate() throws Exception {
        IncomeSource incomeSource = IncomeControllerTest.createIncomeSource(12L);

        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.of(incomeSource));
        when(mockIncomeDao.save(any(Income.class)))
            .thenAnswer(Answers.<Income>modifiedFirstArgument(income -> income.setId(345L)));

        IncomeCommandDTO command = new IncomeCommandDTO(incomeSource.getId(), BigDecimal.TEN);
        mvc.perform(post("/api/persons/{personId}/incomes", person.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(345));
    }
}
