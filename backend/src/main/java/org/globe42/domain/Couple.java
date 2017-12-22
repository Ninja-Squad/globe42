package org.globe42.domain;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;

/**
 * A couple (typically, marriage or PACS) between two persons.
 * This is not designed as a OneToOne association between persons, because the association is optional and needs
 * to be bidirectional. This would either require byte-code enhancements or additional queries to know if the
 * association exists, and this is cumbersome or inefficient because we almost always don't care about this association.
 *
 * Instead, we model this as an entity, and all persons in a couple (i.e. the two persons) have a ManyToOne association
 * with this entity.
 *
 * A couple is immutable: if a person enters in a couple with another person, his/her couple is destroyed and a new one
 * is created. A person can't be in two different couples at the same time.
 *
 * @author JB Nizet
 */
@Entity
public class Couple {
    private static final String COUPLE_GENERATOR = "CoupleGenerator";

    @Id
    @SequenceGenerator(name = COUPLE_GENERATOR, sequenceName = "PERSON_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = COUPLE_GENERATOR)
    private Long id;

    /**
     * The 2 persons in the couple
     */
    @OneToMany(mappedBy = "couple")
    private Set<Person> persons = new HashSet<>();

    public Couple() {
    }

    public Couple(Long id) {
        this.id = id;
    }

    public Couple(Person first, Person second) {
        this.persons.add(first);
        this.persons.add(second);
        first.setCouple(this);
        second.setCouple(this);
    }

    public Person getSpouseOf(Person person) {
        if (!this.persons.contains(person)) {
            throw new IllegalStateException("The person " + person.getId() + " is not involved in this couple " + this.id);
        }
        return persons.stream()
                      .filter(p -> !p.equals(person))
                      .findAny()
                      .orElseThrow(() -> new IllegalStateException("there is no person other than "
                                                                       + person.getId()
                                                                       + " in this couple "
                                                                       + this.id));
    }
}
