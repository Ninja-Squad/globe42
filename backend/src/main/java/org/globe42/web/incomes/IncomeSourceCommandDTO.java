package org.globe42.web.incomes;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Command used to create or update an income source
 * @author JB Nizet
 */
public final class IncomeSourceCommandDTO {

    @NotEmpty
    private final String name;

    @NotNull
    private final Long typeId;
    private final BigDecimal maxMonthlyAmount;

    @JsonCreator
    public IncomeSourceCommandDTO(@JsonProperty String name,
                                  @JsonProperty Long typeId,
                                  @JsonProperty BigDecimal maxMonthlyAmount) {
        this.name = name;
        this.typeId = typeId;
        this.maxMonthlyAmount = maxMonthlyAmount;
    }

    public String getName() {
        return name;
    }

    public Long getTypeId() {
        return typeId;
    }

    public BigDecimal getMaxMonthlyAmount() {
        return maxMonthlyAmount;
    }
}
