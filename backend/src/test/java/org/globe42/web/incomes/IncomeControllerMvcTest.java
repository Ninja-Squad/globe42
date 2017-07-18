package org.globe42.web.incomes;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Income;
import org.globe42.domain.Person;
import org.globe42.test.GlobeMvcTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
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

    @Autowired
    private MockMvc mvc;

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
}
