package org.globe42.web.countries;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.globe42.dao.CountryDao;
import org.globe42.domain.Country;
import org.globe42.test.BaseTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit test for {@link CountryController}
 * @author JB Nizet
 */
public class CountryControllerTest extends BaseTest {

    @Mock
    private CountryDao mockCountryDao;

    @InjectMocks
    private CountryController controller;

    @SuppressWarnings("unchecked")
    @Test
    public void shouldList() {
        when(mockCountryDao.findAllSortedByName()).thenReturn(Arrays.asList(
            new Country("BEL", "Belgique"),
            new Country("FRA", "France")
        ));

        List<CountryDTO> result = controller.list();

        assertThat(result).extracting(CountryDTO::getId, CountryDTO::getName)
                          .containsExactly(tuple("BEL", "Belgique"),
                                           tuple("FRA", "France"));
    }
}
