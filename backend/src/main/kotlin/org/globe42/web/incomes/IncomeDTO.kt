package org.globe42.web.incomes;

import java.math.BigDecimal;

import org.globe42.domain.Income;

/**
 * An income of a person
 * @author JB Nizet
 */
public final class IncomeDTO {
    private final Long id;
    private final IncomeSourceDTO source;
    private final BigDecimal monthlyAmount;

    public IncomeDTO(Income income) {
        this.id = income.getId();
        this.source = new IncomeSourceDTO(income.getSource());
        this.monthlyAmount = income.getMonthlyAmount();
    }

    public Long getId() {
        return id;
    }

    public IncomeSourceDTO getSource() {
        return source;
    }

    public BigDecimal getMonthlyAmount() {
        return monthlyAmount;
    }
}
