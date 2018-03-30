package org.globe42.web.persons;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.globe42.domain.FamilySituation;

/**
 * The family situation of a person, in France or abroad
 * @author JB Nizet
 */
public final class FamilySituationDTO {
    private final boolean parentsPresent;
    private final boolean spousePresent;
    private final Integer childCount;

    public FamilySituationDTO(FamilySituation familySituation) {
        this(familySituation.isParentsPresent(),
             familySituation.isSpousePresent(),
             familySituation.getChildCount());
    }

    @JsonCreator
    public FamilySituationDTO(@JsonProperty boolean parentsPresent,
                              @JsonProperty boolean spousePresent,
                              @JsonProperty Integer childCount) {
        this.parentsPresent = parentsPresent;
        this.spousePresent = spousePresent;
        this.childCount = childCount;
    }

    public boolean isParentsPresent() {
        return parentsPresent;
    }

    public boolean isSpousePresent() {
        return spousePresent;
    }

    public Integer getChildCount() {
        return childCount;
    }
}
