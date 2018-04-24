package org.globe42.domain;

import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;

/**
 * A wedding event of a person (wedding or divorce)
 * @author JB Nizet
 */
@Entity
public class WeddingEvent {

    private static final String WEDDING_EVENT_GENERATOR = "WeddingEventGenerator";

    @Id
    @SequenceGenerator(name = WEDDING_EVENT_GENERATOR, sequenceName = "WEDDING_EVENT_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = WEDDING_EVENT_GENERATOR)
    private Long id;

    @Column(name = "event_date")
    @NotNull
    @Past
    private LocalDate date;

    @NotNull
    private WeddingEventType type;

    @ManyToOne
    @NotNull
    private Person person;

    public WeddingEvent() {
    }

    public WeddingEvent(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public WeddingEventType getType() {
        return type;
    }

    public void setType(WeddingEventType type) {
        this.type = type;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }
}
