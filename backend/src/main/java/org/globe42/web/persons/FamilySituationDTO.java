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
    private final Integer siblingCount;

    public FamilySituationDTO(FamilySituation familySituation) {
        this(familySituation.isParentsPresent(),
             familySituation.isSpousePresent(),
             familySituation.getChildCount(),
             familySituation.getSiblingCount());
    }

    @JsonCreator
    public FamilySituationDTO(@JsonProperty boolean parentsPresent,
                              @JsonProperty boolean spousePresent,
                              @JsonProperty Integer childCount,
                              @JsonProperty Integer siblingCount) {
        this.parentsPresent = parentsPresent;
        this.spousePresent = spousePresent;
        this.childCount = childCount;
        this.siblingCount = siblingCount;
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

    public Integer getSiblingCount() {
        return siblingCount;
    }
}
