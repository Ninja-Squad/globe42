package org.globe42.web.activities;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import org.globe42.domain.Person;
import org.globe42.web.persons.PersonIdentityDTO;

/**
 * Information about a participant to an activity type
 * @author JB Nizet
 */
public final class ParticipantDTO {

    @JsonUnwrapped
    private final PersonIdentityDTO identity;

    private final String email;
    private final String phoneNumber;

    public ParticipantDTO(Person person) {
        this.identity = new PersonIdentityDTO(person);
        this.email = person.getEmail();
        this.phoneNumber = person.getPhoneNumber();
    }

    public PersonIdentityDTO getIdentity() {
        return identity;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}
