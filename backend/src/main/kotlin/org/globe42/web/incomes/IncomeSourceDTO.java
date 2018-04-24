package org.globe42.web.incomes;

import java.math.BigDecimal;

import org.globe42.domain.IncomeSource;

/**
 * DTO of an income source
 * @see org.globe42.domain.IncomeSource
 * @author JB Nizet
 */
public final class IncomeSourceDTO {
    private final Long id;
    private final String name;
    private final IncomeSourceTypeDTO type;
    private final BigDecimal maxMonthlyAmount;

    public IncomeSourceDTO(IncomeSource incomeSource) {
        this.id = incomeSource.getId();
        this.name = incomeSource.getName();
        this.type = new IncomeSourceTypeDTO(incomeSource.getType());
        this.maxMonthlyAmount = incomeSource.getMaxMonthlyAmount();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public IncomeSourceTypeDTO getType() {
        return type;
    }

    public BigDecimal getMaxMonthlyAmount() {
        return maxMonthlyAmount;
    }
}
