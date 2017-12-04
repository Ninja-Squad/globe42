package org.globe42.web.cities;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.globe42.dao.PostalCityDao;
import org.globe42.domain.PostalCity;
import org.globe42.test.BaseTest;
import org.globe42.web.persons.CityDTO;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link PostalCityController}
 * @author JB Nizet
 */
public class PostalCityControllerTest extends BaseTest {
    @Mock
    private PostalCityDao mockPostalCityDao;

    @Mock
    private PostalCityUploadParser mockUploadParser;

    @InjectMocks
    private PostalCityController controller;

    @Test
    public void shouldSearchByPostalCodeWhenQueryIsNumeric() {
        PostalCity postalCity = new PostalCity("42000", "ST ETIENNE");
        when(mockPostalCityDao.findByPostalCode("420", PostalCityController.LIMIT)).thenReturn(
            Arrays.asList(postalCity)
        );

        List<CityDTO> result = controller.search("420");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo(postalCity.getPostalCode());
        assertThat(result.get(0).getCity()).isEqualTo(postalCity.getCity());
    }

    @Test
    public void shouldSearchByCityWhenQueryIsNotNumeric() {
        PostalCity postalCity = new PostalCity("42000", "ST ETIENNE");
        when(mockPostalCityDao.findByCity("ST ET", PostalCityController.LIMIT)).thenReturn(
            Arrays.asList(postalCity)
        );

        List<CityDTO> result = controller.search("ST ET");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo(postalCity.getPostalCode());
        assertThat(result.get(0).getCity()).isEqualTo(postalCity.getCity());
    }

    @Test
    public void shouldUpload() {
        byte[] body = "fake".getBytes();
        List<PostalCity> parsedCities = Arrays.asList(new PostalCity("42000", "ST ETIENNE"));
        when(mockUploadParser.parse(body)).thenReturn(parsedCities);

        controller.upload(body);

        verify(mockPostalCityDao).saveAllEfficiently(parsedCities);
    }
}