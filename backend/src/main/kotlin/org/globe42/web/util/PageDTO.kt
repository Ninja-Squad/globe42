package org.globe42.web.util

import org.springframework.data.domain.Page

/**
 * A page of data
 *
 * @param <T> the type of data in this page
 * @author JB Nizet
 */
data class PageDTO<T>(

        /**
         * The elements in this page. Its size is less than or equal to [.size]
         */
        val content: List<T>,

        /**
         * The number of this page, starting from 0
         */
        val number: Int,

        /**
         * The size of a page
         */
        val size: Int,

        /**
         * The total number of elements
         */
        val totalElements: Long,

        /**
         * The total number of pages
         */
        val totalPages: Int)

fun <I, T> Page<I>.toDTO(mapper: (I) -> T): PageDTO<T> {
    return PageDTO(content.map(mapper),
                   number,
                   size,
                   totalElements,
                   totalPages)
}
