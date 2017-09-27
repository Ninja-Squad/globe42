package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A category of charges like, for example, "house rental charge". Charge types (like "mortgage", or "electricity")
 * belong to a single charge category. And actual charges of a person have a charge type.
 * This is kind of like an enum, except we don't want to change, build and deploy the
 * application if we discover that there's a missing category.
 * @author JB Nizet
 */
@Entity
public class ChargeCategory {

    private static final String CHARGE_CATEGORY_GENERATOR = "ChargeCategoryGenerator";

    @Id
    @SequenceGenerator(name = CHARGE_CATEGORY_GENERATOR, sequenceName = "CHARGE_CATEGORY_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = CHARGE_CATEGORY_GENERATOR)
    private Long id;

    /**
     * The name of the category, as displayed in the application
     */
    @NotEmpty
    private String name;

    public ChargeCategory() {
    }

    public ChargeCategory(Long id) {
        this.id = id;
    }

    public ChargeCategory(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
