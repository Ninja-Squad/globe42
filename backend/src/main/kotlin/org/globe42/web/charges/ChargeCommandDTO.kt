package org.globe42.web.charges;

import java.math.BigDecimal;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A command used to create a charge for a person
 * @author JB Nizet
 */
public final class ChargeCommandDTO {

    /**
     * The ID of the source of the charge
     */
    @NotNull
    private final Long typeId;

    /**
     * The monthly amount of the charge
     */
    @NotNull
    private final BigDecimal monthlyAmount;

    @JsonCreator
    public ChargeCommandDTO(@JsonProperty Long typeId,
                            @JsonProperty BigDecimal monthlyAmount) {
        this.typeId = typeId;
        this.monthlyAmount = monthlyAmount;
    }

    public Long getTypeId() {
        return typeId;
    }

    public BigDecimal getMonthlyAmount() {
        return monthlyAmount;
    }
}
