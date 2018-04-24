package org.globe42.web.countries;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.globe42.dao.CountryDao;
import org.globe42.domain.Country;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC test for {@link CountryController}
 * @author JB Nizet
 */
@GlobeMvcTest(CountryController.class)
public class CountryControllerMvcTest {

    @MockBean
    private CountryDao mockCountryDao;

    @Autowired
    private MockMvc mvc;

    @BeforeEach
    public void prepare() {
        when(mockCountryDao.findAllSortedByName()).thenReturn(Arrays.asList(
            new Country("BEL", "Belgique"),
            new Country("FRA", "France")
        ));
    }

    @Test
    public void shouldList() throws Exception {
        mvc.perform(get("/api/countries"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].id").value("BEL"))
           .andExpect(jsonPath("$[1].name").value("France"));
    }
}
