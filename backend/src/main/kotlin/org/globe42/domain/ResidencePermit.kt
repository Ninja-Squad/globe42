package org.globe42.domain

/**
 * A type of Residence Permit for a person, in France. Persons only have one of such Residence Permit types, at a given moment.
 * @author A Crepet
 */
enum class ResidencePermit {
    UNKNOWN,
    RECEIPT_OF_APPLICATION_FOR_FIRST_RESIDENCE_PERMIT,
    RECEIPT_OF_RENEWAL_RESIDENCE_PERMIT,
    RETIREMENT_RESIDENCE_PERMIT,
    TEN_YEAR_OLD_RESIDENT,
    TEMPORARY_RESIDENCE_PRIVATE_AND_FAMILY_LIFE,
    OTHER
}