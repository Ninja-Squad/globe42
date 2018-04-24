package org.globe42.web.charges;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.ChargeDao;
import org.globe42.dao.ChargeTypeDao;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Charge;
import org.globe42.domain.ChargeCategory;
import org.globe42.domain.ChargeType;
import org.globe42.domain.Person;
import org.globe42.test.Answers;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.NotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link ChargeController}
 * @author JB Nizet
 */
public class ChargeControllerTest extends BaseTest {

    @Mock
    private PersonDao mockPersonDao;

    @Mock
    private ChargeDao mockChargeDao;

    @Mock
    private ChargeTypeDao mockChargeTypeDao;

    @InjectMocks
    private ChargeController controller;

    @Test
    public void shouldList() {
        Long personId = 42L;
        Person person = new Person(personId);
        Charge charge = createCharge(12L);
        person.addCharge(charge);
        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));

        List<ChargeDTO> result = controller.list(personId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(charge.getId());
        assertThat(result.get(0).getType().getId()).isEqualTo(charge.getType().getId());
        assertThat(result.get(0).getMonthlyAmount()).isEqualTo(charge.getMonthlyAmount());
    }

    @Test
    public void shouldThrowIfPersonNotFound() {
        Long personId = 42L;
        when(mockPersonDao.findById(personId)).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.list(personId));
    }

    @Test
    public void shouldDelete() {
        Long personId = 42L;
        Long chargeId = 12L;
        Charge charge = new Charge(chargeId);
        charge.setPerson(new Person(personId));
        when(mockChargeDao.findById(chargeId)).thenReturn(Optional.of(charge));

        controller.delete(personId, chargeId);

        verify(mockChargeDao).delete(charge);
    }

    @Test
    public void shouldAcceptDeletionIfNotFoundToBeIdempotent() {
        Long chargeId = 12L;
        when(mockChargeDao.findById(chargeId)).thenReturn(Optional.empty());

        controller.delete(42L, chargeId);

        verify(mockChargeDao, never()).delete(any());
    }

    @Test
    public void shouldRejectDeletionIfNotInCorrectPerson() {
        Long chargeId = 12L;
        Long personId = 42L;
        Charge charge = new Charge(chargeId);
        charge.setPerson(new Person(personId));

        when(mockChargeDao.findById(chargeId)).thenReturn(Optional.of(charge));

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.delete(456L, chargeId));
    }

    @Test
    public void shouldCreate() {
        Long personId = 42L;
        Long typeId = 12L;

        Person person = new Person(personId);
        ChargeType type = createChargeType(typeId);

        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));
        when(mockChargeTypeDao.findById(typeId)).thenReturn(Optional.of(type));
        when(mockChargeDao.save(any(Charge.class))).thenAnswer(
            Answers.<Charge>modifiedFirstArgument(charge -> charge.setId(34L)));

        ChargeCommandDTO command = new ChargeCommandDTO(typeId, BigDecimal.TEN);

        ChargeDTO result = controller.create(personId, command);

        assertThat(result.getId()).isEqualTo(34L);
        assertThat(result.getMonthlyAmount()).isEqualByComparingTo(command.getMonthlyAmount());
        assertThat(result.getType().getId()).isEqualTo(command.getTypeId());
    }

    @Test
    public void shouldThrowWhenCreatingForUnknownPerson() {
        Long personId = 42L;
        Long typeId = 12L;

        Person person = new Person(personId);
        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));
        when(mockChargeTypeDao.findById(typeId)).thenReturn(Optional.empty());

        ChargeCommandDTO command = new ChargeCommandDTO(typeId, BigDecimal.TEN);
        assertThatExceptionOfType(BadRequestException.class).isThrownBy(() -> controller.create(personId, command));
    }

    @Test
    public void shouldThrowWhenCreatingWithTooLargeAmount() {
        Long personId = 42L;
        Long typeId = 12L;

        Person person = new Person(personId);
        ChargeType type = createChargeType(typeId);
        type.setMaxMonthlyAmount(new BigDecimal("9"));
        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));
        when(mockChargeTypeDao.findById(typeId)).thenReturn(Optional.of(type));

        ChargeCommandDTO command = new ChargeCommandDTO(typeId, BigDecimal.TEN);
        assertThatExceptionOfType(BadRequestException.class).isThrownBy(() -> controller.create(personId, command));
    }

    @Test
    public void shouldThrowWhenCreatingForUnknownType() {
        Long personId = 42L;
        Long typeId = 12L;

        when(mockPersonDao.findById(personId)).thenReturn(Optional.empty());

        ChargeCommandDTO command = new ChargeCommandDTO(typeId, BigDecimal.TEN);
        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.create(personId, command));
    }

    static Charge createCharge(Long id) {
        Charge charge = new Charge(id);
        ChargeType chargeType = createChargeType(id * 10);
        charge.setType(chargeType);
        charge.setMonthlyAmount(new BigDecimal("123.45"));
        return charge;
    }

    static ChargeType createChargeType(Long id) {
        ChargeType chargeType = new ChargeType(id);
        chargeType.setCategory(new ChargeCategory(id * 10, "rental"));
        return chargeType;
    }
}
