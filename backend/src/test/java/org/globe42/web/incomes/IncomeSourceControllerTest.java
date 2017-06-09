package org.globe42.web.incomes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.IncomeSourceDao;
import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSource;
import org.globe42.domain.IncomeSourceType;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link IncomeSourceController}
 * @author JB Nizet
 */
public class IncomeSourceControllerTest extends BaseTest {
    @Mock
    private IncomeSourceDao mockIncomeSourceDao;

    @Mock
    private IncomeSourceTypeDao mockIncomeSourceTypeDao;

    @InjectMocks
    private IncomeSourceController controller;

    @Captor
    private ArgumentCaptor<IncomeSource> incomeSourceArgumentCaptor;

    private IncomeSource incomeSource;

    @Before
    public void prepare() {
        incomeSource = new IncomeSource(42L);
        incomeSource.setName("source 1");
        incomeSource.setType(new IncomeSourceType(1L, "type 1"));
        incomeSource.setMaxMonthlyAmount(new BigDecimal("1234.56"));
    }

    @Test
    public void shouldList() {
        when(mockIncomeSourceDao.findAll()).thenReturn(Collections.singletonList(incomeSource));

        List<IncomeSourceDTO> result = controller.list();

        assertThat(result).hasSize(1);
        IncomeSourceDTO dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(incomeSource.getId());
        assertThat(dto.getName()).isEqualTo(incomeSource.getName());
        assertThat(dto.getType().getId()).isEqualTo(incomeSource.getType().getId());
        assertThat(dto.getType().getType()).isEqualTo(incomeSource.getType().getType());
        assertThat(dto.getMaxMonthlyAmount()).isEqualTo(incomeSource.getMaxMonthlyAmount());
        assertThat(dto.getId()).isEqualTo(incomeSource.getId());
    }

    @Test
    public void shouldGet() {
        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.of(incomeSource));

        IncomeSourceDTO result = controller.get(incomeSource.getId());

        assertThat(result.getId()).isEqualTo(incomeSource.getId());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowWhenGettingWithUnknownId() {
        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.empty());

        controller.get(incomeSource.getId());
    }

    @Test
    public void shouldCreate() {
        IncomeSourceCommandDTO command = createCommand();

        when(mockIncomeSourceTypeDao.findById(command.getTypeId()))
            .thenReturn(Optional.of(new IncomeSourceType(command.getTypeId(), "type 2")));
        when(mockIncomeSourceDao.save(any(IncomeSource.class))).thenReturn(incomeSource);

        IncomeSourceDTO result = controller.create(command);

        verify(mockIncomeSourceDao).save(incomeSourceArgumentCaptor.capture());

        assertThat(result).isNotNull();
        assertIncomeSourceEqualsCommand(incomeSourceArgumentCaptor.getValue(), command);
    }

    @Test(expected = BadRequestException.class)
    public void shouldThrowWhenCreatingWithUnknownIncomeSourceType() {
        IncomeSourceCommandDTO command = createCommand();

        when(mockIncomeSourceTypeDao.findById(command.getTypeId()))
            .thenReturn(Optional.of(new IncomeSourceType(command.getTypeId(), "type 2")));
        when(mockIncomeSourceDao.existsByName(command.getName())).thenReturn(true);

        controller.create(command);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowWhenCreatingWithExistingName() {
        IncomeSourceCommandDTO command = createCommand();

        when(mockIncomeSourceTypeDao.findById(command.getTypeId())).thenReturn(Optional.empty());

        controller.create(command);
    }

    @Test
    public void shouldUpdate() {
        IncomeSourceCommandDTO command = createCommand();

        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.of(incomeSource));
        when(mockIncomeSourceTypeDao.findById(command.getTypeId()))
            .thenReturn(Optional.of(new IncomeSourceType(command.getTypeId(), "type 2")));

        controller.update(incomeSource.getId(), command);

        assertIncomeSourceEqualsCommand(incomeSource, command);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfNotFoundWhenUpdating() {
        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.empty());

        controller.update(incomeSource.getId(), createCommand());
    }

    @Test(expected = BadRequestException.class)
    public void shouldThrowWhenUpdatingWithAlreadyUsedNickName() {
        IncomeSourceCommandDTO command = createCommand();

        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.of(incomeSource));
        when(mockIncomeSourceTypeDao.findById(command.getTypeId()))
            .thenReturn(Optional.of(new IncomeSourceType(command.getTypeId(), "type 2")));
        when(mockIncomeSourceDao.findByName(command.getName())).thenReturn(Optional.of(new IncomeSource(4567L)));

        controller.update(incomeSource.getId(), command);
    }

    @Test
    public void shouldUpdateIfSameSurnameIsKept() {
        IncomeSourceCommandDTO command = createCommand();

        when(mockIncomeSourceDao.findById(incomeSource.getId())).thenReturn(Optional.of(incomeSource));
        when(mockIncomeSourceTypeDao.findById(command.getTypeId()))
            .thenReturn(Optional.of(new IncomeSourceType(command.getTypeId(), "type 2")));
        when(mockIncomeSourceDao.findByName(command.getName())).thenReturn(Optional.of(incomeSource));

        controller.update(incomeSource.getId(), command);

        assertIncomeSourceEqualsCommand(incomeSource, command);
    }

    static IncomeSourceCommandDTO createCommand() {
        return new IncomeSourceCommandDTO("source 2", 2L, new BigDecimal("12.34"));
    }

    private void assertIncomeSourceEqualsCommand(IncomeSource source, IncomeSourceCommandDTO command) {
        assertThat(source.getName()).isEqualTo(command.getName());
        assertThat(source.getType().getId()).isEqualTo(command.getTypeId());
        assertThat(source.getMaxMonthlyAmount()).isEqualTo(command.getMaxMonthlyAmount());
    }
}