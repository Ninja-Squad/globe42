package org.globe42.domain

/**
 * A type of Visa for a person, in France. Persons only have one of such Visa types, at a given moment.
 * @author A Crepet
 */
enum class Visa {
    UNKNOWN,
    SHORT_STAY,
    LONG_STAY
}