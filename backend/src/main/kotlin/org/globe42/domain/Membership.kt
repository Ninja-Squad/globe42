package org.globe42.domain

import java.time.LocalDate
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.SequenceGenerator
import javax.validation.constraints.NotNull

private const val MEMBERSHIP_GENERATOR = "MembershipGenerator"

/**
 * A yearly membership of a person in the Globe42 association
 * @author JB Nizet
 */
@Entity
class Membership {
    @Id
    @SequenceGenerator(
        name = MEMBERSHIP_GENERATOR,
        sequenceName = "MEMBERSHIP_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = MEMBERSHIP_GENERATOR)
    var id: Long? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    lateinit var person: Person

    val year: Int

    @NotNull
    lateinit var paymentDate: LocalDate

    @NotNull
    @Enumerated(EnumType.STRING)
    lateinit var paymentMode: PaymentMode

    var cardNumber: Int? = null

    constructor(id: Long) {
        this.id = id
        this.year = LocalDate.now(PARIS_TIME_ZONE).year
    }

    constructor(person: Person, year: Int) {
        this.person = person
        this.year = year
    }

    constructor(
        id: Long,
        person: Person,
        year: Int,
        paymentDate: LocalDate,
        paymentMode: PaymentMode,
        cardNumber: Int
    ) : this(person, year) {
        this.id = id
        this.paymentDate = paymentDate
        this.paymentMode = paymentMode
        this.cardNumber = cardNumber
    }
}
