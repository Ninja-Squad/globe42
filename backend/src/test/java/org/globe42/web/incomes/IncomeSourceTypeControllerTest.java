package org.globe42.web.incomes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSourceType;
import org.globe42.test.BaseTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
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

    @Captor
    private ArgumentCaptor<IncomeSourceType> incomeSourceTypeArgumentCaptor;

    private IncomeSourceType incomeSourceType;

    @Before
    public void prepare() {
        incomeSourceType = new IncomeSourceType(1L, "CAF");
    }

    @Test
    public void shouldGet() {
        when(mockIncomeSourceTypeDao.findById(incomeSourceType.getId())).thenReturn(Optional.of(incomeSourceType));

        IncomeSourceTypeDTO result = controller.get(incomeSourceType.getId());

        assertThat(result.getId()).isEqualTo(incomeSourceType.getId());
    }

    @Test
    public void shouldList() {
        when(mockIncomeSourceTypeDao.findAll()).thenReturn(
            Collections.singletonList(incomeSourceType));

        List<IncomeSourceTypeDTO> result = controller.list();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getType()).isEqualTo("CAF");
    }

    @Test
    public void shouldCreate() {
        IncomeSourceTypeCommandDTO command = createCommand();

        when(mockIncomeSourceTypeDao.existsByType(command.getType())).thenReturn(false);
        when(mockIncomeSourceTypeDao.save(any(IncomeSourceType.class))).thenReturn(incomeSourceType);

        IncomeSourceTypeDTO result = controller.create(command);

        verify(mockIncomeSourceTypeDao).save(incomeSourceTypeArgumentCaptor.capture());

        assertThat(result).isNotNull();
        assertIncomeSourceTypeEqualsCommand(incomeSourceTypeArgumentCaptor.getValue(), command);
    }

    static IncomeSourceTypeCommandDTO createCommand() {
        return new IncomeSourceTypeCommandDTO("Securité Sociale");
    }

    private void assertIncomeSourceTypeEqualsCommand(IncomeSourceType source, IncomeSourceTypeCommandDTO command) {
        assertThat(source.getType()).isEqualTo(command.getType());
    }
}