package org.globe42.web.charges;

import java.math.BigDecimal;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Command used to create or update a charge type
 * @author JB Nizet
 */
public final class ChargeTypeCommandDTO {

    @NotEmpty
    private final String name;

    @NotNull
    private final Long categoryId;
    private final BigDecimal maxMonthlyAmount;

    @JsonCreator
    public ChargeTypeCommandDTO(@JsonProperty String name,
                                @JsonProperty Long categoryId,
                                @JsonProperty BigDecimal maxMonthlyAmount) {
        this.name = name;
        this.categoryId = categoryId;
        this.maxMonthlyAmount = maxMonthlyAmount;
    }

    public String getName() {
        return name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public BigDecimal getMaxMonthlyAmount() {
        return maxMonthlyAmount;
    }
}
