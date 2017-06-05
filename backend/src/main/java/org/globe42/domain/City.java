package org.globe42.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import org.hibernate.validator.constraints.Length;

/**
 * A city, with its postal code
 * @author JB Nizet
 */
@Embeddable
public class City {
    @Length(min = 5, max = 5)
    @Column(name = "postal_code")
    private String code;
    private String city;

    public City() {
    }

    public City(String code, String city) {
        this.code = code;
        this.city = city;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
