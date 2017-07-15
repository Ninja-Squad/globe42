package org.globe42.dao;

/**
 * Custom methods of {@link PersonDao}
 * @author JB Nizet
 */
public interface PersonDaoCustom {

    /**
     * Gets the next sequence number for the given mediation code letter (which should be 'a' to 'z' or 'A' to 'Z')
     */
    int nextMediationCode(char letter);
}
