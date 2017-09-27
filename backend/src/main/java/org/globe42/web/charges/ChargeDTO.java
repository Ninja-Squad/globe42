package org.globe42.web.charges;

import java.math.BigDecimal;

import org.globe42.domain.Charge;

/**
 * A financial charge of a person
 * @author JB Nizet
 */
public final class ChargeDTO {
    private final Long id;
    private final ChargeTypeDTO type;
    private final BigDecimal monthlyAmount;

    public ChargeDTO(Charge charge) {
        this.id = charge.getId();
        this.type = new ChargeTypeDTO(charge.getType());
        this.monthlyAmount = charge.getMonthlyAmount();
    }

    public Long getId() {
        return id;
    }

    public ChargeTypeDTO getType() {
        return type;
    }

    public BigDecimal getMonthlyAmount() {
        return monthlyAmount;
    }
}
