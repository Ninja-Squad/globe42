package org.globe42.web.charges;

import static org.assertj.core.api.Assertions.assertThat;
import static org.globe42.test.Answers.modifiedFirstArgument;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.ChargeCategoryDao;
import org.globe42.domain.ChargeCategory;
import org.globe42.test.BaseTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link ChargeCategoryController}
 * @author JB Nizet
 */
public class ChargeCategoryControllerTest extends BaseTest {

    @Mock
    private ChargeCategoryDao mockChargeCategoryDao;

    @InjectMocks
    private ChargeCategoryController controller;

    @Captor
    private ArgumentCaptor<ChargeCategory> chargeCategoryArgumentCaptor;

    private ChargeCategory chargeCategory;

    @Before
    public void prepare() {
        chargeCategory = new ChargeCategory(1L, "rental");
    }

    @Test
    public void shouldGet() {
        when(mockChargeCategoryDao.findById(chargeCategory.getId())).thenReturn(Optional.of(chargeCategory));

        ChargeCategoryDTO result = controller.get(chargeCategory.getId());

        assertThat(result.getId()).isEqualTo(chargeCategory.getId());
    }

    @Test
    public void shouldList() {
        when(mockChargeCategoryDao.findAll()).thenReturn(
            Collections.singletonList(chargeCategory));

        List<ChargeCategoryDTO> result = controller.list();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getName()).isEqualTo("rental");
    }

    @Test
    public void shouldCreate() {
        ChargeCategoryCommandDTO command = createCommand();

        when(mockChargeCategoryDao.existsByName(command.getName())).thenReturn(false);
        when(mockChargeCategoryDao.save(any(ChargeCategory.class)))
            .thenAnswer(modifiedFirstArgument((ChargeCategory st) -> st.setId(42L)));

        ChargeCategoryDTO result = controller.create(command);

        verify(mockChargeCategoryDao).save(chargeCategoryArgumentCaptor.capture());

        assertThat(result.getId()).isEqualTo(42L);
        assertChargeCategoryEqualsCommand(chargeCategoryArgumentCaptor.getValue(), command);
    }

    @Test
    public void shouldUpdate() {
        ChargeCategoryCommandDTO command = createCommand();

        when(mockChargeCategoryDao.findById(chargeCategory.getId())).thenReturn(Optional.of(chargeCategory));
        when(mockChargeCategoryDao.findByName(command.getName())).thenReturn(Optional.empty());

        controller.update(chargeCategory.getId(), command);

        assertChargeCategoryEqualsCommand(chargeCategory, command);
    }

    static ChargeCategoryCommandDTO createCommand() {
        return new ChargeCategoryCommandDTO("Food");
    }

    private void assertChargeCategoryEqualsCommand(ChargeCategory source, ChargeCategoryCommandDTO command) {
        assertThat(source.getName()).isEqualTo(command.getName());
    }
}
