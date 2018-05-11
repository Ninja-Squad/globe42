package org.globe42.domain

import javax.persistence.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

const val NETWORK_MEMBER_GENERATOR = "NetworkMemberGenerator"

/**
 * A member of the network of a person. We only store its type and some text, which can contain anything (the name, the
 * phone number, etc.), depending on what the users find important.
 *
 * A person can have several network members of the same type.
 *
 * @author JB Nizet
 */
@Entity
class NetworkMember {
    @Id
    @SequenceGenerator(
        name = NETWORK_MEMBER_GENERATOR,
        sequenceName = "NETWORK_MEMBER_SEQ",
        initialValue = 1000,
        allocationSize = 1
    )
    @GeneratedValue(generator = NETWORK_MEMBER_GENERATOR)
    var id: Long? = null

    /**
     * The person who has this network member
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    lateinit var person: Person

    @NotNull
    @Enumerated(EnumType.STRING)
    lateinit var type: NetworkMemberType

    @NotEmpty
    lateinit var text: String

    constructor()

    constructor(id: Long) {
        this.id = id
    }

    constructor(type: NetworkMemberType, text: String) {
        this.type = type
        this.text = text
    }
}
