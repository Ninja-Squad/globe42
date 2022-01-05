package org.globe42.web.persons

import org.globe42.domain.PaymentMode
import java.time.LocalDate
import javax.validation.constraints.NotNull
import javax.validation.constraints.PastOrPresent

/**
 * Command sent to create or update a membership
 * @author JB Nizet
 */
data class MembershipCommandDTO(
    @field:NotNull val year: Int,
    @field:NotNull val paymentMode: PaymentMode,
    @field:NotNull @field:PastOrPresent val paymentDate: LocalDate,
    val cardNumber: Int?
)
