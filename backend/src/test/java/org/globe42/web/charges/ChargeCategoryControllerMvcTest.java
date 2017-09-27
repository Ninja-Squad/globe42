package org.globe42.web.charges;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

import org.globe42.dao.ChargeCategoryDao;
import org.globe42.domain.ChargeCategory;
import org.globe42.test.GlobeMvcTest;
import org.globe42.web.incomes.IncomeSourceTypeController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link IncomeSourceTypeController}
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeCategoryController.class)
@RunWith(SpringRunner.class)
public class ChargeCategoryControllerMvcTest {

    @MockBean
    private ChargeCategoryDao mockChargeCategoryDao;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldList() throws Exception {
        when(mockChargeCategoryDao.findAll()).thenReturn(
            Collections.singletonList(new ChargeCategory(1L, "category1")));

        mvc.perform(get("/api/charge-categories"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(1))
           .andExpect(jsonPath("$[0].name").value("category1"));
    }
}
