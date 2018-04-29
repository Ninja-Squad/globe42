package org.globe42.web.persons

import org.globe42.domain.PerUnitRevenueInformation

/**
 * DTO for PerUnitRevenueInformationDTO
 * @author JB Nizet
 */
data class PerUnitRevenueInformationDTO(val adultLikeCount: Int, val childCount: Int, val monoParental: Boolean) {
    constructor(info: PerUnitRevenueInformation) : this(info.adultLikeCount, info.childCount, info.monoParental)
}
