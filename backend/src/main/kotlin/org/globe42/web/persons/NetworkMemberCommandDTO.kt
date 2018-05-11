package org.globe42.web.persons

import org.globe42.domain.NetworkMemberType
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

/**
 * Command sent to create a network member
 * @author JB Nizet
 */
data class NetworkMemberCommandDTO(@field:NotNull val type: NetworkMemberType, @field:NotEmpty val text: String)
