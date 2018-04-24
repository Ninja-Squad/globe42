package org.globe42.web.countries;

import org.globe42.domain.Country;

/**
 * A DTO for the {@link Country} entity
 * @author JB Nizet
 */
public final class CountryDTO {
    private final String id;
    private final String name;

    public CountryDTO(Country country) {
        this.id = country.getId();
        this.name = country.getName();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
