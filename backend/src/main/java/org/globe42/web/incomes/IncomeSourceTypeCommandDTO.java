package org.globe42.web.incomes;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

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
