package org.globe42.domain;

import java.math.BigDecimal;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;

/**
 * An income that a person has, provided by an income source.
 * @author JB Nizet
 */
@Entity
public class Income {
    private static final String INCOME_GENERATOR = "IncomeGenerator";

    @Id
    @SequenceGenerator(name = INCOME_GENERATOR, sequenceName = "INCOME_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = INCOME_GENERATOR)
    private Long id;

    /**
     * The person which benefits from this income
     */
    @ManyToOne
    @NotNull
    private Person person;

    /**
     * The source of the income
     */
    @ManyToOne
    @NotNull
    private IncomeSource source;

    /**
     * The monthly amount of the income
     */
    @NotNull
    private BigDecimal monthlyAmount;

    public Income() {
    }

    public Income(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public IncomeSource getSource() {
        return source;
    }

    public void setSource(IncomeSource source) {
        this.source = source;
    }

    public BigDecimal getMonthlyAmount() {
        return monthlyAmount;
    }

    public void setMonthlyAmount(BigDecimal monthlyAmount) {
        this.monthlyAmount = monthlyAmount;
    }
}
