package org.globe42.web.persons;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.globe42.domain.ActivityType;

/**
 * Command used to create new participation
 * @author JB Nizet
 */
public final class ParticipationCommandDTO {
    private final ActivityType activityType;

    @JsonCreator
    public ParticipationCommandDTO(@JsonProperty("activityType") ActivityType activityType) {
        this.activityType = activityType;
    }

    public ActivityType getActivityType() {
        return activityType;
    }
}
