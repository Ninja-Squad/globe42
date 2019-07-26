package org.globe42.web.persons

import java.time.LocalDate
import javax.validation.constraints.NotNull
import javax.validation.constraints.PastOrPresent

/**
 * Command sent to signal the death ofa person
 * @author JB Nizet
 */
data class PersonDeathCommandDTO(@field:NotNull @field:PastOrPresent val deathDate: LocalDate)
