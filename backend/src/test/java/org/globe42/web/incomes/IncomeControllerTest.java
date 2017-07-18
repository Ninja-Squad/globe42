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
import org.globe42.dao.PersonDao;
import org.globe42.domain.Income;
import org.globe42.domain.IncomeSource;
import org.globe42.domain.IncomeSourceType;
import org.globe42.domain.Person;
import org.globe42.test.BaseTest;
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

    static Income createIncome(Long id) {
        Income income = new Income(id);
        IncomeSource incomeSource = new IncomeSource(id * 10);
        incomeSource.setType(new IncomeSourceType(id * 100, "CAF"));
        income.setSource(incomeSource);
        income.setMonthlyAmount(new BigDecimal("123.45"));
        return income;
    }
}
