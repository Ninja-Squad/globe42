package org.globe42.web

import org.springframework.core.Ordered

/**
 * The orders of the filters installed by the application
 * @author JB Nizet
 */
object FilterOrdering {
    /**
     * The index filter must be the first one because
     * - it uses the X-Forwarded-Proto header to know if we're running behind a proxy and the request was received
     *   over HTTP, and this header is hidden from the chain by the ForwardedHeaderFilter
     * - it should come before the authentication filter because requests coming over HTTP should be denied
     *   instead of being analyzed by the authentication filter
     */
    const val INDEX = -2

    /**
     * The ForwardedHeaderFilter should come next, because the remaining of the app should know we use https
     */
    const val FORWARDED_HEADER = -1
}
