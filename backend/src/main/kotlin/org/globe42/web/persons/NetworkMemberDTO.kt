package org.globe42.web.persons

import org.globe42.domain.NetworkMember
import org.globe42.domain.NetworkMemberType

/**
 * DTO for [org.globe42.domain.WeddingEvent]
 * @author JB Nizet
 */
data class NetworkMemberDTO(
    val id: Long,
    val type: NetworkMemberType,
    val text: String
) {

    constructor(member: NetworkMember) : this(
        member.id!!,
        member.type,
        member.text
    )
}
