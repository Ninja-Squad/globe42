package org.globe42.web.charges;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.dao.ChargeCategoryDao;
import org.globe42.dao.ChargeTypeDao;
import org.globe42.domain.ChargeCategory;
import org.globe42.domain.ChargeType;
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
 * MVC tests for {@link ChargeTypeController}
 * @author JB Nizet
 */
@RunWith(SpringRunner.class)
@GlobeMvcTest(ChargeTypeController.class)
public class ChargeTypeControllerMvcTest {

    @MockBean
    private ChargeTypeDao mockChargeTypeDao;

    @MockBean
    private ChargeCategoryDao mockChargeCategoryDao;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mvc;

    private ChargeType chargeType;

    @Before
    public void prepare() {
        chargeType = new ChargeType(42L);
        chargeType.setName("source 1");
        chargeType.setCategory(new ChargeCategory(1L, "category 1"));
        chargeType.setMaxMonthlyAmount(new BigDecimal("1234.56"));
    }

    @Test
    public void shouldList() throws Exception {
        when(mockChargeTypeDao.findAll()).thenReturn(Collections.singletonList(chargeType));

        mvc.perform(get("/api/charge-types"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value(42))
           .andExpect(jsonPath("$[0].name").value(chargeType.getName()))
           .andExpect(jsonPath("$[0].category.id").value(chargeType.getCategory().getId()))
           .andExpect(jsonPath("$[0].category.name").value(chargeType.getCategory().getName()))
           .andExpect(jsonPath("$[0].maxMonthlyAmount").value(chargeType.getMaxMonthlyAmount().doubleValue()));
    }

    @Test
    public void shouldGet() throws Exception {
        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.of(chargeType));

        mvc.perform(get("/api/charge-types/{typeId}", chargeType.getId()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.id").value(42));
    }

    @Test
    public void shouldCreate() throws Exception {
        ChargeTypeCommandDTO command = ChargeTypeControllerTest.createCommand();
        when(mockChargeTypeDao.save(any(ChargeType.class))).thenReturn(chargeType);
        when(mockChargeCategoryDao.findById(command.getCategoryId())).thenReturn(Optional.of(chargeType.getCategory()));

        mvc.perform(post("/api/charge-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(42));
    }

    @Test
    public void shouldUpdate() throws Exception {
        ChargeTypeCommandDTO command = ChargeTypeControllerTest.createCommand();

        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.of(chargeType));
        when(mockChargeCategoryDao.findById(command.getCategoryId())).thenReturn(Optional.of(chargeType.getCategory()));

        mvc.perform(put("/api/charge-types/{sourceId}", chargeType.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(command)))
           .andExpect(status().isNoContent());
    }
}
