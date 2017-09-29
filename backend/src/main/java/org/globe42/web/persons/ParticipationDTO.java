package org.globe42.web.persons;

import org.globe42.domain.ActivityType;
import org.globe42.domain.Participation;

/**
 * The participation of a person to an activity type
 * @author JB Nizet
 */
public final class ParticipationDTO {
    private final Long id;
    private final ActivityType activityType;

    public ParticipationDTO(Participation participation) {
        this.id = participation.getId();
        this.activityType = participation.getActivityType();
    }

    public Long getId() {
        return id;
    }

    public ActivityType getActivityType() {
        return activityType;
    }
}
