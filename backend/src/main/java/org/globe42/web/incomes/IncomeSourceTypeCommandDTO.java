package org.globe42.web.incomes;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Command sent to create or update an income source type
 */
public class IncomeSourceTypeCommandDTO {

    @NotEmpty
    private final String type;

    @JsonCreator
    public IncomeSourceTypeCommandDTO(@JsonProperty String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
