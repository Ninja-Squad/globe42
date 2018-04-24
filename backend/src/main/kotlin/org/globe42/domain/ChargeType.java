package org.globe42.domain;

import java.math.BigDecimal;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 * A type of charge, belonging to a charge category. The same type is shared by many persons, through the {@link Charge}
 * entity.
 * @author JB Nizet
 */
@Entity
public class ChargeType {
    private static final String CHARGE_TYPE_GENERATOR = "ChargeTypeGenerator";

    @Id
    @SequenceGenerator(name = CHARGE_TYPE_GENERATOR, sequenceName = "CHARGE_TYPE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = CHARGE_TYPE_GENERATOR)
    private Long id;

    /**
     * The name of the charge type (mortgage, electricity, gas, etc.)
     */
    @NotEmpty
    private String name;

    /**
     * The type of the income source
     */
    @ManyToOne
    @NotNull
    private ChargeCategory category;

    /**
     * The maximum monthly amount (in euros) that the charge can reach. Null if no known maximum.
     */
    private BigDecimal maxMonthlyAmount;

    public ChargeType() {
    }

    public ChargeType(Long id) {
        this.id = id;
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

    public ChargeCategory getCategory() {
        return category;
    }

    public void setCategory(ChargeCategory category) {
        this.category = category;
    }

    public BigDecimal getMaxMonthlyAmount() {
        return maxMonthlyAmount;
    }

    public void setMaxMonthlyAmount(BigDecimal maxMonthlyAmount) {
        this.maxMonthlyAmount = maxMonthlyAmount;
    }
}
