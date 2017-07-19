package org.globe42.web.incomes;

import java.math.BigDecimal;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A command used to create an income for a person
 * @author JB Nizet
 */
public final class IncomeCommandDTO {

    /**
     * The ID of the source of the income
     */
    @NotNull
    private final Long sourceId;

    /**
     * The monthly amount of the income
     */
    @NotNull
    private final BigDecimal monthlyAmount;

    @JsonCreator
    public IncomeCommandDTO(@JsonProperty Long sourceId,
                            @JsonProperty BigDecimal monthlyAmount) {
        this.sourceId = sourceId;
        this.monthlyAmount = monthlyAmount;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public BigDecimal getMonthlyAmount() {
        return monthlyAmount;
    }
}
