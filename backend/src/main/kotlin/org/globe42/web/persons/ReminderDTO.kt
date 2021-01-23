package org.globe42.web.persons

import java.time.Duration
import java.time.LocalDate
import java.time.Period

/**
 * The various types of reminder for a given person
 * @author JB Nizet
 */
sealed class ReminderDTO(val type: ReminderType)

class HealthInsuranceToRenewDTO(val endDate: LocalDate) : ReminderDTO(ReminderType.HEALTH_INSURANCE_TO_RENEW)
class ResidencePermitToRenewDTO(val endDate: LocalDate) : ReminderDTO(ReminderType.RESIDENCE_PERMIT_TO_RENEW)
class HealthCheckToPlanDTO(val lastDate: LocalDate?) : ReminderDTO(ReminderType.HEALTH_CHECK_TO_PLAN)
object MembershipToRenewDTO : ReminderDTO(ReminderType.MEMBERSHIP_TO_RENEW)
object MembershipPaymentOutOfDateDTO : ReminderDTO(ReminderType.MEMBERSHIP_PAYMENT_OUT_OF_DATE)

enum class ReminderType {
    HEALTH_INSURANCE_TO_RENEW,
    RESIDENCE_PERMIT_TO_RENEW,
    HEALTH_CHECK_TO_PLAN,
    MEMBERSHIP_TO_RENEW,
    MEMBERSHIP_PAYMENT_OUT_OF_DATE
}

val HEALTH_INSURANCE_PERIOD = Period.ofYears(1)
val HEALTH_INSURANCE_DELAY_BEFORE_REMINDER = Period.ofMonths(1)
val RESIDENCE_PERMIT_DELAY_BEFORE_REMINDER = Period.ofMonths(3)
val HEALTH_CHECK_PERIOD = Period.ofYears(2)
