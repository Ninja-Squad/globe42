package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;

/**
 * The participation of a person into an activity type. Only one participation can exist for a given
 * person and a given activity type.
 * @author JB Nizet
 */
@Entity
public class Participation {
    private static final String PARTICIPATION_GENERATOR = "ParticipationGenerator";

    @Id
    @SequenceGenerator(name = PARTICIPATION_GENERATOR, sequenceName = "PARTICIPATION_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = PARTICIPATION_GENERATOR)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ActivityType activityType;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    private Person person;

    public Participation() {
    }

    public Participation(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }
}
