package org.globe42.domain

import java.util.*
import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.OneToMany
import javax.persistence.SequenceGenerator

private const val FAMILY_GENERATOR = "FamilyGenerator"

/**
 * The family of a person
 * @author JB Nizet
 */
@Entity
class Family {
    @Id
    @SequenceGenerator(name = FAMILY_GENERATOR, sequenceName = "FAMILY_SEQ", initialValue = 1000, allocationSize = 1)
    @GeneratedValue(generator = FAMILY_GENERATOR)
    var id: Long? = null

    /**
     * null if the person doesn't have a spouse. Otherwise, the location of the spouse.
     */
    @Enumerated(EnumType.STRING)
    var spouseLocation: Location? = null

    /**
     * The children of the person
     */
    @OneToMany(mappedBy = "family", cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    private val relatives: MutableSet<Relative> = HashSet()

    fun getRelatives(): Set<Relative> {
        return Collections.unmodifiableSet(relatives)
    }

    fun addRelative(relative: Relative) {
        relative.family = this
        relatives.add(relative)
    }

    fun removeRelative(relative: Relative) {
        relatives.remove(relative)
    }

    fun clearRelatives() {
        relatives.clear()
    }
}
