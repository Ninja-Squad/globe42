package org.globe42.web.incomes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;

import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSourceType;
import org.globe42.test.BaseTest;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link IncomeSourceTypeController}
 * @author JB Nizet
 */
public class IncomeSourceTypeControllerTest extends BaseTest {

    @Mock
    private IncomeSourceTypeDao mockIncomeSourceTypeDao;

    @InjectMocks
    private IncomeSourceTypeController controller;

    @Test
    public void shouldList() {
        when(mockIncomeSourceTypeDao.findAll()).thenReturn(
            Collections.singletonList(new IncomeSourceType(1L, "type1")));

        List<IncomeSourceTypeDTO> result = controller.list();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getType()).isEqualTo("type1");
    }
}