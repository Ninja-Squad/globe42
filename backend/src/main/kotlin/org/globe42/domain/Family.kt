package org.globe42.domain

import java.util.*
import javax.persistence.*

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
     * true if the person has a parent in France
     */
    var parentInFrance = false;

    /**
     * true if the person has a parent abroad
     */
    var parentAbroad = false;

    /**
     * null if the person doesn't have a spouse. Otherwise, the location of the spouse.
     */
    @Enumerated(EnumType.STRING)
    var spouseLocation: Location? = null

    /**
     * The children of the person
     */
    @OneToMany(mappedBy = "family", cascade = arrayOf(CascadeType.ALL), orphanRemoval = true)
    private val children: MutableSet<Child> = HashSet()

    fun getChildren(): Set<Child> {
        return Collections.unmodifiableSet(children)
    }

    fun addChild(child: Child) {
        child.family = this
        children.add(child)
    }

    fun removeChild(child: Child) {
        children.remove(child)
    }

    fun clearChildren() {
        children.clear()
    }
}
