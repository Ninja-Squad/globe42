package org.globe42.domain

/**
 * A statistic about spent time for a category and a user
 * @author JB Nizet
 */
data class SpentTimeStatistic(val category: TaskCategory, val user: User, val minutes: Int)
