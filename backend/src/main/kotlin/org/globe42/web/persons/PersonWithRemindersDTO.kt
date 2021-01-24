package org.globe42.web.persons

import com.fasterxml.jackson.annotation.JsonUnwrapped

/**
 * A DTO of a person with its contact information and its reminders
 * @author JB Nizet
 */
data class PersonWithRemindersDTO(
    @field:JsonUnwrapped val identity: PersonIdentityDTO,
    val email: String?,
    val phoneNumber: String?,
    val reminders: List<ReminderDTO>
)
