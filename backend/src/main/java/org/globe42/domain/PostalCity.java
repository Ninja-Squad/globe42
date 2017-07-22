package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A city, imported from the official postal code reference at
 * <a href="https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/">Data Gouv</a>.
 * @author JB Nizet
 */
@Entity
public class PostalCity {
    private static final String POSTAL_CITY_GENERATOR = "PostalCityGenerator";

    @Id
    @SequenceGenerator(name = POSTAL_CITY_GENERATOR, sequenceName = "POSTAL_CITY_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = POSTAL_CITY_GENERATOR)
    private Long id;

    @NotEmpty
    private String postalCode;

    /**
     * The city, which is supposed to be in uppercase
     */
    @NotEmpty
    private String city;

    public PostalCity() {
    }

    public PostalCity(Long id) {
        this.id = id;
    }

    public PostalCity(String postalCode, String city) {
        this.postalCode = postalCode;
        this.city = city;
    }

    public Long getId() {
        return id;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCity() {
        return city;
    }
}
