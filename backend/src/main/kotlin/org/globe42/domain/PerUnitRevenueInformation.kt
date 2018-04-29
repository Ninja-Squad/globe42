package org.globe42.domain

import javax.persistence.Embeddable

/**
 * Information needed to be able to compute the per unit revenue of the person. The computation consists in
 * dividing the income by the number of units in the households.
 *
 *  - The first adult in the household counts for 1 unit;
 *  - every other adult or child who is at least 14 years old counts for 0.5 unit;
 *  - every child less than 14 years old counts for 0.3 unit;
 *  - an additional 0.2 unit is added if the household is mono-parental.
 *
 * So, if a single parent has a child aged 16 and two children aged 12 and 10, and has a monthly income of 2000,
 * the per unit revenue is `2000 / (1 + 0.5 + 2 * 0.3 + 0.2) = 869.57`
 */
@Embeddable
data class PerUnitRevenueInformation(
    /**
     * The number of adults or children aged at least 14
     */
    val adultLikeCount: Int,

    /**
     * The number of children aged less than 14
     */
    val childCount: Int,

    /**
     * true if the household is mono-parental
     */
    val monoParental: Boolean)
