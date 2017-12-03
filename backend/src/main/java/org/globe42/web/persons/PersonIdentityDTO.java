package org.globe42.web.persons;

import org.globe42.domain.Person;

/**
 * A DTO allowing to identify a person. Used in person list.
 * @author JB Nizet
 */
public final class PersonIdentityDTO {
    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String nickName;
    private final String mediationCode;

    public PersonIdentityDTO(Person person) {
        this.id = person.getId();
        this.firstName = person.getFirstName();
        this.lastName = person.getLastName();
        this.nickName = person.getNickName();
        // we hide the mediation code if mediation is disabled
        this.mediationCode = person.isMediationEnabled() ? person.getMediationCode() : null;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getNickName() {
        return nickName;
    }

    public String getMediationCode() {
        return mediationCode;
    }
}
