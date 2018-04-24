package org.globe42.dao

/**
 * Custom methods of [PersonDao]
 * @author JB Nizet
 */
interface PersonDaoCustom {

    /**
     * Gets the next sequence number for the given mediation code letter (which should be 'a' to 'z' or 'A' to 'Z')
     */
    fun nextMediationCode(letter: Char): Int
}
