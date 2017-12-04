package org.globe42.web.incomes;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSourceType;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link IncomeSourceTypeController}
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeSourceTypeController.class)
public class IncomeSourceTypeControllerMvcTest {

    @MockBean
    private IncomeSourceTypeDao mockIncomeSourceTypeDao;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldList() throws Exception {
        when(mockIncomeSourceTypeDao.findAll()).thenReturn(
            Collections.singletonList(new IncomeSourceType(1L, "type1")));

        mvc.perform(get("/api/income-source-types"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(1))
           .andExpect(jsonPath("$[0].type").value("type1"));
    }
}