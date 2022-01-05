package org.globe42.web.persons

import org.globe42.domain.Membership
import org.globe42.domain.PaymentMode
import java.time.LocalDate

/**
 * DTO for [Membership]
 * @author JB Nizet
 */
data class MembershipDTO(
    val id: Long,
    val year: Int,
    val paymentMode: PaymentMode,
    val paymentDate: LocalDate,
    val cardNumber: Int?
) {
    constructor(membership: Membership) : this(
        membership.id!!,
        membership.year,
        membership.paymentMode,
        membership.paymentDate,
        membership.cardNumber
    )
}
