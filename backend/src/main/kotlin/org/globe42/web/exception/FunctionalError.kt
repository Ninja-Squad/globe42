package org.globe42.web.exception

import com.fasterxml.jackson.annotation.JsonInclude

/**
 * A functional error, sent as part of an error response body.
 * @author JB Nizet
 */
data class FunctionalError(

    /**
     * The code of the error
     */
    val code: ErrorCode,

    /**
     * The parameters of the error. The values can be of any type, but must be serializable to JSON. They should most
     * of the time be simple strings or numbers.
     */
    @field:JsonInclude(JsonInclude.Include.NON_EMPTY) val parameters: Map<String, Any>
)
