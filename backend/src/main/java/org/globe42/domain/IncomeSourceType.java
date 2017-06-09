package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A type of income source. This is kind of like an enum, except we don't want to change, build and deploy the
 * application if we discover that there's a missing type.
 * @author JB Nizet
 */
@Entity
public class IncomeSourceType {

    private static final String INCOME_SOURCE_TYPE_GENERATOR = "IncomeSourceTypeGenerator";

    @Id
    @SequenceGenerator(name = INCOME_SOURCE_TYPE_GENERATOR, sequenceName = "INCOME_SOURCE_TYPE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = INCOME_SOURCE_TYPE_GENERATOR)
    private Long id;

    /**
     * The type, as displayed in the application
     */
    @NotEmpty
    private String type;

    public IncomeSourceType() {
    }

    public IncomeSourceType(Long id) {
        this.id = id;
    }

    public IncomeSourceType(Long id, String type) {
        this.id = id;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
