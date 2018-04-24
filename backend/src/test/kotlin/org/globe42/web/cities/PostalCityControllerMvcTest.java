package org.globe42.web.cities;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.globe42.dao.PostalCityDao;
import org.globe42.domain.PostalCity;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * MVC tests for {@link PostalCityController}
 * @author JB Nizet
 */
@GlobeMvcTest(PostalCityController.class)
public class PostalCityControllerMvcTest {

    @MockBean
    private PostalCityDao mockPostalCityDao;

    @MockBean
    private PostalCityUploadParser mockUploadParser;

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldSearch() throws Exception {
        PostalCity postalCity = new PostalCity("42000", "ST ETIENNE");
        when(mockPostalCityDao.findByCity("ST E", PostalCityController.LIMIT)).thenReturn(
            Arrays.asList(postalCity)
        );

        mvc.perform(get("/api/cities").param("query", "ST E"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].code").value("42000"))
           .andExpect(jsonPath("$[0].city").value("ST ETIENNE"));
    }

    @Test
    public void shouldUpload() throws Exception {
        byte[] body = "fake".getBytes();
        List<PostalCity> parsedCities = Arrays.asList(new PostalCity("42000", "ST ETIENNE"));
        when(mockUploadParser.parse(body)).thenReturn(parsedCities);

        mvc.perform(post("/api/cities/uploads").content(body))
           .andExpect(status().isCreated());

        verify(mockPostalCityDao).saveAllEfficiently(parsedCities);
    }
}