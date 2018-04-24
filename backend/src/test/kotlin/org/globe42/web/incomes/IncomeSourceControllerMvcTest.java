package org.globe42.web.incomes;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.IncomeSourceDao;
import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSource;
import org.globe42.domain.IncomeSourceType;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link IncomeSourceController}
 * @author JB Nizet
 */
@GlobeMvcTest(IncomeSourceController.class)
public class IncomeSourceControllerMvcTest {

    @MockBean
    private IncomeSourceDao mockIncomeSourceDao;

    @MockBean
    private IncomeSourceTypeDao mockIncomeSourceTypeDao;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mvc;

    private IncomeSource incomeSource;

    @BeforeEach
    public void prepare() {
        incomeSource = new IncomeSource(42L);
        incomeSource.setName("source 1");
        incomeSource.setType(new IncomeSourceType(1L, "type 1"));
        incomeSource.setMaxMonthlyAmount(new BigDecimal("1234.56"));
    }

    @Test
    public void shouldList() throws Exception {
        when(mockIncomeSourceDao.findAll()).thenReturn(Collections.singletonList(incomeSource));

        mvc.perform(get("/api/income-sources"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(42))
           .andExpect(jsonPath("$[0].name").value(incomeSource.getName()))
           .andExpect(jsonPath("$[0].type.id").value(incomeSource.getType().getId()))
           .andExpect(jsonPath("$[0].type.type").value(incomeSource.getType().getType()))
           .andExpect(jsonPath("$[0].maxMonthlyAmount").value(incomeSource.getMaxMonthlyAmount().doubleValue()));
    }

    @Test
    public void shouldGet() throws Exception {
        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.of(incomeSource));

        mvc.perform(get("/api/income-sources/{sourceId}", incomeSource.getId()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.id").value(42));
    }

    @Test
    public void shouldCreate() throws Exception {
        IncomeSourceCommandDTO command = IncomeSourceControllerTest.createCommand();
        when(mockIncomeSourceDao.save(any(IncomeSource.class))).thenReturn(incomeSource);
        when(mockIncomeSourceTypeDao.findById(command.getTypeId())).thenReturn(Optional.of(incomeSource.getType()));

        mvc.perform(post("/api/income-sources")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(42));
    }

    @Test
    public void shouldUpdate() throws Exception {
        IncomeSourceCommandDTO command = IncomeSourceControllerTest.createCommand();

        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.of(incomeSource));
        when(mockIncomeSourceTypeDao.findById(command.getTypeId())).thenReturn(Optional.of(incomeSource.getType()));

        mvc.perform(put("/api/income-sources/{sourceId}", incomeSource.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isNoContent());
    }
}
