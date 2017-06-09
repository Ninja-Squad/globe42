package org.globe42.domain;

import java.math.BigDecimal;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * A source of income. The same source is shared by many persons, through the {@link Income} entity.
 * @author JB Nizet
 */
@Entity
public class IncomeSource {
    private static final String INCOME_SOURCE_GENERATOR = "IncomeSourceGenerator";

    @Id
    @SequenceGenerator(name = INCOME_SOURCE_GENERATOR, sequenceName = "INCOME_SOURCE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = INCOME_SOURCE_GENERATOR)
    private Long id;

    /**
     * The name of the source of income (APL, Agirc/Arrco, etc.)
     */
    @NotEmpty
    private String name;

    /**
     * The type of the income source
     */
    @ManyToOne
    @NotNull
    private IncomeSourceType type;

    /**
     * The maximum monthly amount (in euros) that the income source can give as income. Null if no known maximum.
     */
    private BigDecimal maxMonthlyAmount;

    public IncomeSource() {
    }

    public IncomeSource(Long id) {
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

    public IncomeSourceType getType() {
        return type;
    }

    public void setType(IncomeSourceType type) {
        this.type = type;
    }

    public BigDecimal getMaxMonthlyAmount() {
        return maxMonthlyAmount;
    }

    public void setMaxMonthlyAmount(BigDecimal maxMonthlyAmount) {
        this.maxMonthlyAmount = maxMonthlyAmount;
    }
}
