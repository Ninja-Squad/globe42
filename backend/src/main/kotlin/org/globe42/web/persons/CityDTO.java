package org.globe42.web.persons;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.globe42.domain.City;
import org.globe42.domain.PostalCity;
import org.hibernate.validator.constraints.Length;

/**
 * DTO for a city
 * @author JB Nizet
 */
public final class CityDTO {

    @Length(min = 5, max = 5)
    private final String code;
    private final String city;

    @JsonCreator
    public CityDTO(@JsonProperty String code,
                   @JsonProperty String city) {
        this.code = code;
        this.city = city;
    }

    public CityDTO(City city) {
        this.code = city.getCode();
        this.city = city.getCity();
    }

    public CityDTO(PostalCity city) {
        this.code = city.getPostalCode();
        this.city = city.getCity();
    }

    public String getCode() {
        return code;
    }

    public String getCity() {
        return city;
    }
}
