package org.globe42.web.incomes;

import org.globe42.domain.IncomeSourceType;

/**
 * DTO for an income source type
 * @see IncomeSourceType
 * @author JB Nizet
 */
public final class IncomeSourceTypeDTO {
    private final Long id;
    private final String type;

    public IncomeSourceTypeDTO(IncomeSourceType incomeSourceType) {
        this.id = incomeSourceType.getId();
        this.type = incomeSourceType.getType();
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }
}
