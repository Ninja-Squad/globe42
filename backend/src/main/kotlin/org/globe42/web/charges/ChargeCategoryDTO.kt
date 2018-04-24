package org.globe42.web.charges;

import org.globe42.domain.ChargeCategory;
import org.globe42.domain.IncomeSourceType;

/**
 * DTO for a charge category
 * @see IncomeSourceType
 * @author JB Nizet
 */
public final class ChargeCategoryDTO {
    private final Long id;
    private final String name;

    public ChargeCategoryDTO(ChargeCategory category) {
        this.id = category.getId();
        this.name = category.getName();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
