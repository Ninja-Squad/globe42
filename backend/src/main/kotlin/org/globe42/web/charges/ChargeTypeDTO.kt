package org.globe42.web.charges;

import java.math.BigDecimal;

import org.globe42.domain.ChargeType;

/**
 * DTO of a charge type
 * @see ChargeType
 * @author JB Nizet
 */
public final class ChargeTypeDTO {
    private final Long id;
    private final String name;
    private final ChargeCategoryDTO category;
    private final BigDecimal maxMonthlyAmount;

    public ChargeTypeDTO(ChargeType chargeType) {
        this.id = chargeType.getId();
        this.name = chargeType.getName();
        this.category = new ChargeCategoryDTO(chargeType.getCategory());
        this.maxMonthlyAmount = chargeType.getMaxMonthlyAmount();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ChargeCategoryDTO getCategory() {
        return category;
    }

    public BigDecimal getMaxMonthlyAmount() {
        return maxMonthlyAmount;
    }
}
