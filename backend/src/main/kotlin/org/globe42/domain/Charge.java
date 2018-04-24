package org.globe42.domain;

import java.math.BigDecimal;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;

/**
 * A finanacial charge that a person has to pay on a monthly basis.
 * @author JB Nizet
 */
@Entity
public class Charge {
    private static final String CHARGE_GENERATOR = "ChargeGenerator";

    @Id
    @SequenceGenerator(name = CHARGE_GENERATOR, sequenceName = "CHARGE_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = CHARGE_GENERATOR)
    private Long id;

    /**
     * The person which benefits from this income
     */
    @ManyToOne
    @NotNull
    private Person person;

    /**
     * The type of the charge
     */
    @ManyToOne
    @NotNull
    private ChargeType type;

    /**
     * The monthly amount of the charge
     */
    @NotNull
    private BigDecimal monthlyAmount;

    public Charge() {
    }

    public Charge(Long id) {
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

    public ChargeType getType() {
        return type;
    }

    public void setType(ChargeType type) {
        this.type = type;
    }

    public BigDecimal getMonthlyAmount() {
        return monthlyAmount;
    }

    public void setMonthlyAmount(BigDecimal monthlyAmount) {
        this.monthlyAmount = monthlyAmount;
    }
}
