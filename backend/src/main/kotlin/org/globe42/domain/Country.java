package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * A country (used to serve as a nationality, in fact), identified by an ISO 3166-1 alpha-3 country code`
 * See https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
 * @author JB Nizet
 */
@Entity
public class Country {

    /**
     * The ISO code of the country
     */
    @Id
    private String id;

    /**
     * The French name of the country
     */
    private String name;

    public Country() {
    }

    public Country(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
