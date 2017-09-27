package org.globe42.web.charges;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Command sent to create or update a charge category
 */
public class ChargeCategoryCommandDTO {

    @NotEmpty
    private final String name;

    @JsonCreator
    public ChargeCategoryCommandDTO(@JsonProperty String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
