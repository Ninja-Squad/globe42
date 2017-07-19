package org.globe42.web.incomes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.IncomeDao;
import org.globe42.dao.IncomeSourceDao;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Income;
import org.globe42.domain.IncomeSource;
import org.globe42.domain.IncomeSourceType;
import org.globe42.domain.Person;
import org.globe42.test.Answers;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.NotFoundException;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link IncomeController}
 * @author JB Nizet
 */
public class IncomeControllerTest extends BaseTest {

    @Mock
    private PersonDao mockPersonDao;

    @Mock
    private IncomeDao mockIncomeDao;

    @Mock
    private IncomeSourceDao mockIncomeSourceDao;

    @InjectMocks
    private IncomeController controller;

    @Test
    public void shouldList() {
        Long personId = 42L;
        Person person = new Person(personId);
        Income income = createIncome(12L);
        person.addIncome(income);
        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));

        List<IncomeDTO> result = controller.list(personId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(income.getId());
        assertThat(result.get(0).getSource().getId()).isEqualTo(income.getSource().getId());
        assertThat(result.get(0).getMonthlyAmount()).isEqualTo(income.getMonthlyAmount());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowIfPersonNotFound() {
        Long personId = 42L;
        when(mockPersonDao.findById(personId)).thenReturn(Optional.empty());

        controller.list(personId);
    }

    @Test
    public void shouldDelete() {
        Long personId = 42L;
        Long incomeId = 12L;
        Income income = new Income(incomeId);
        income.setPerson(new Person(personId));
        when(mockIncomeDao.findById(incomeId)).thenReturn(Optional.of(income));

        controller.delete(personId, incomeId);

        verify(mockIncomeDao).delete(income);
    }

    @Test
    public void shouldAcceptDeletionIfNotFoundToBeIdempotent() {
        Long incomeId = 12L;
        when(mockIncomeDao.findById(incomeId)).thenReturn(Optional.empty());

        controller.delete(42L, incomeId);

        verify(mockIncomeDao, never()).delete(any());
    }

    @Test(expected = NotFoundException.class)
    public void shouldRejectDeletionIfNotInCorrectPerson() {
        Long incomeId = 12L;
        Long personId = 42L;
        Income income = new Income(incomeId);
        income.setPerson(new Person(personId));

        when(mockIncomeDao.findById(incomeId)).thenReturn(Optional.of(income));

        controller.delete(456L, incomeId);
    }

    @Test
    public void shouldCreate() {
        Long personId = 42L;
        Long sourceId = 12L;

        Person person = new Person(personId);
        IncomeSource source = createIncomeSource(sourceId);

        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));
        when(mockIncomeSourceDao.findById(sourceId)).thenReturn(Optional.of(source));
        when(mockIncomeDao.save(any(Income.class))).thenAnswer(
            Answers.<Income>modifiedFirstArgument(income -> income.setId(34L)));

        IncomeCommandDTO command = new IncomeCommandDTO(sourceId, BigDecimal.TEN);

        IncomeDTO result = controller.create(personId, command);

        assertThat(result.getId()).isEqualTo(34L);
        assertThat(result.getMonthlyAmount()).isEqualByComparingTo(command.getMonthlyAmount());
        assertThat(result.getSource().getId()).isEqualTo(command.getSourceId());
    }

    @Test(expected = BadRequestException.class)
    public void shouldThrowWhenCreatingForUnknownPerson() {
        Long personId = 42L;
        Long sourceId = 12L;

        Person person = new Person(personId);
        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));
        when(mockIncomeSourceDao.findById(sourceId)).thenReturn(Optional.empty());

        IncomeCommandDTO command = new IncomeCommandDTO(sourceId, BigDecimal.TEN);
        controller.create(personId, command);
    }

    @Test(expected = BadRequestException.class)
    public void shouldThrowWhenCreatingWithTooLargeAmount() {
        Long personId = 42L;
        Long sourceId = 12L;

        Person person = new Person(personId);
        IncomeSource source = createIncomeSource(sourceId);
        source.setMaxMonthlyAmount(new BigDecimal("9"));
        when(mockPersonDao.findById(personId)).thenReturn(Optional.of(person));
        when(mockIncomeSourceDao.findById(sourceId)).thenReturn(Optional.of(source));

        IncomeCommandDTO command = new IncomeCommandDTO(sourceId, BigDecimal.TEN);
        controller.create(personId, command);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowWhenCreatingForUnknownSource() {
        Long personId = 42L;
        Long sourceId = 12L;

        when(mockPersonDao.findById(personId)).thenReturn(Optional.empty());

        IncomeCommandDTO command = new IncomeCommandDTO(sourceId, BigDecimal.TEN);
        controller.create(personId, command);
    }

    static Income createIncome(Long id) {
        Income income = new Income(id);
        IncomeSource incomeSource = createIncomeSource(id * 10);
        income.setSource(incomeSource);
        income.setMonthlyAmount(new BigDecimal("123.45"));
        return income;
    }

    static IncomeSource createIncomeSource(Long id) {
        IncomeSource incomeSource = new IncomeSource(id);
        incomeSource.setType(new IncomeSourceType(id * 10, "CAF"));
        return incomeSource;
    }
}
