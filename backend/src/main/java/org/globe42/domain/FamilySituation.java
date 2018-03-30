package org.globe42.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

/**
 * The family situation of a person (in France, or abroad)
 * @author JB Nizet
 */
@Entity
public class FamilySituation {

    private static final String FAMILY_SITUATION_GENERATOR = "FamilySituationGenerator";

    @Id
    @SequenceGenerator(name = FAMILY_SITUATION_GENERATOR, sequenceName = "FAMILY_SITUATION_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = FAMILY_SITUATION_GENERATOR)
    private Long id;

    private boolean parentsPresent;
    private boolean spousePresent;
    private Integer childCount;

    public FamilySituation() {
    }

    public FamilySituation(Long id) {
        this.id = id;
    }

    public FamilySituation(boolean parentsPresent,
                           boolean spousePresent,
                           Integer childCount) {
        this.parentsPresent = parentsPresent;
        this.spousePresent = spousePresent;
        this.childCount = childCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isParentsPresent() {
        return parentsPresent;
    }

    public void setParentsPresent(boolean parentsPresent) {
        this.parentsPresent = parentsPresent;
    }

    public boolean isSpousePresent() {
        return spousePresent;
    }

    public void setSpousePresent(boolean spousePresent) {
        this.spousePresent = spousePresent;
    }

    public Integer getChildCount() {
        return childCount;
    }

    public void setChildCount(Integer childCount) {
        this.childCount = childCount;
    }
}
