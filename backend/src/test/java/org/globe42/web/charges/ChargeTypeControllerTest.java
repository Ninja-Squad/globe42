package org.globe42.web.charges;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.ChargeCategoryDao;
import org.globe42.dao.ChargeTypeDao;
import org.globe42.domain.ChargeCategory;
import org.globe42.domain.ChargeType;
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
 * Unit tests for {@link ChargeTypeController}
 * @author JB Nizet
 */
public class ChargeTypeControllerTest extends BaseTest {
    @Mock
    private ChargeTypeDao mockChargeTypeDao;

    @Mock
    private ChargeCategoryDao mockChargeCategoryDao;

    @InjectMocks
    private ChargeTypeController controller;

    @Captor
    private ArgumentCaptor<ChargeType> chargeTypeArgumentCaptor;

    private ChargeType chargeType;

    @Before
    public void prepare() {
        chargeType = new ChargeType(42L);
        chargeType.setName("source 1");
        chargeType.setCategory(new ChargeCategory(1L, "category 1"));
        chargeType.setMaxMonthlyAmount(new BigDecimal("1234.56"));
    }

    @Test
    public void shouldList() {
        when(mockChargeTypeDao.findAll()).thenReturn(Collections.singletonList(chargeType));

        List<ChargeTypeDTO> result = controller.list();

        assertThat(result).hasSize(1);
        ChargeTypeDTO dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(chargeType.getId());
        assertThat(dto.getName()).isEqualTo(chargeType.getName());
        assertThat(dto.getCategory().getId()).isEqualTo(chargeType.getCategory().getId());
        assertThat(dto.getCategory().getName()).isEqualTo(chargeType.getCategory().getName());
        assertThat(dto.getMaxMonthlyAmount()).isEqualTo(chargeType.getMaxMonthlyAmount());
        assertThat(dto.getId()).isEqualTo(chargeType.getId());
    }

    @Test
    public void shouldGet() {
        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.of(chargeType));

        ChargeTypeDTO result = controller.get(chargeType.getId());

        assertThat(result.getId()).isEqualTo(chargeType.getId());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowWhenGettingWithUnknownId() {
        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.empty());

        controller.get(chargeType.getId());
    }

    @Test
    public void shouldCreate() {
        ChargeTypeCommandDTO command = createCommand();

        when(mockChargeCategoryDao.findById(command.getCategoryId()))
            .thenReturn(Optional.of(new ChargeCategory(command.getCategoryId(), "category 2")));
        when(mockChargeTypeDao.save(any(ChargeType.class))).thenReturn(chargeType);

        ChargeTypeDTO result = controller.create(command);

        verify(mockChargeTypeDao).save(chargeTypeArgumentCaptor.capture());

        assertThat(result).isNotNull();
        assertChargeTypeEqualsCommand(chargeTypeArgumentCaptor.getValue(), command);
    }

    @Test(expected = BadRequestException.class)
    public void shouldThrowWhenCreatingWithUnknownChargeCategory() {
        ChargeTypeCommandDTO command = createCommand();

        when(mockChargeCategoryDao.findById(command.getCategoryId()))
            .thenReturn(Optional.of(new ChargeCategory(command.getCategoryId(), "category 2")));
        when(mockChargeTypeDao.existsByName(command.getName())).thenReturn(true);

        controller.create(command);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowWhenCreatingWithExistingName() {
        ChargeTypeCommandDTO command = createCommand();

        when(mockChargeCategoryDao.findById(command.getCategoryId())).thenReturn(Optional.empty());

        controller.create(command);
    }

    @Test
    public void shouldUpdate() {
        ChargeTypeCommandDTO command = createCommand();

        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.of(chargeType));
        when(mockChargeCategoryDao.findById(command.getCategoryId()))
            .thenReturn(Optional.of(new ChargeCategory(command.getCategoryId(), "category 2")));

        controller.update(chargeType.getId(), command);

        assertChargeTypeEqualsCommand(chargeType, command);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfNotFoundWhenUpdating() {
        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.empty());

        controller.update(chargeType.getId(), createCommand());
    }

    @Test(expected = BadRequestException.class)
    public void shouldThrowWhenUpdatingWithAlreadyUsedNickName() {
        ChargeTypeCommandDTO command = createCommand();

        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.of(chargeType));
        when(mockChargeCategoryDao.findById(command.getCategoryId()))
            .thenReturn(Optional.of(new ChargeCategory(command.getCategoryId(), "category 2")));
        when(mockChargeTypeDao.findByName(command.getName())).thenReturn(Optional.of(new ChargeType(4567L)));

        controller.update(chargeType.getId(), command);
    }

    @Test
    public void shouldUpdateIfSameSurnameIsKept() {
        ChargeTypeCommandDTO command = createCommand();

        when(mockChargeTypeDao.findById(chargeType.getId())).thenReturn(Optional.of(chargeType));
        when(mockChargeCategoryDao.findById(command.getCategoryId()))
            .thenReturn(Optional.of(new ChargeCategory(command.getCategoryId(), "category 2")));
        when(mockChargeTypeDao.findByName(command.getName())).thenReturn(Optional.of(chargeType));

        controller.update(chargeType.getId(), command);

        assertChargeTypeEqualsCommand(chargeType, command);
    }

    static ChargeTypeCommandDTO createCommand() {
        return new ChargeTypeCommandDTO("source 2", 2L, new BigDecimal("12.34"));
    }

    private void assertChargeTypeEqualsCommand(ChargeType source, ChargeTypeCommandDTO command) {
        assertThat(source.getName()).isEqualTo(command.getName());
        assertThat(source.getCategory().getId()).isEqualTo(command.getCategoryId());
        assertThat(source.getMaxMonthlyAmount()).isEqualTo(command.getMaxMonthlyAmount());
    }
}
