package org.globe42.web.tasks

import org.globe42.domain.SpentTime
import org.globe42.web.users.UserDTO
import java.time.Instant

/**
 * DTO for a [SpentTime]
 * @author JB Nizet
 */
data class SpentTimeDTO(
        val id: Long,
        val minutes: Int,
        val creator: UserDTO,
        val creationInstant: Instant) {

    constructor(spentTime: SpentTime): this(spentTime.id!!,
                                            spentTime.minutes,
                                            UserDTO(spentTime.creator!!),
                                            spentTime.creationInstant)
}
