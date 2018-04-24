package org.globe42.web.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import java.util.*

/**
 * Exception thrown to signal that a request is incorrect. Translated to a 400 HTTP status.
 * It contains an error containing a code and error parameters, that allows the backend to display a parameterized
 * error message when getting such an error response.
 * @author JB Nizet
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
class BadRequestException : RuntimeException {

    val error: FunctionalError?

    /**
     * Should be used seldomly: it doesn't add any functional error. This constructor is useful
     * to signal an error that is semantically a bad request, but which should theoretically never happen,
     * and should thus not lead to a functional error message being displayed.
     */
    constructor(message: String) : super(message) {
        this.error = null
    }

    /**
     * Creates a BadRequestException with a functional error
     */
    constructor(error: FunctionalError) : super(error.code.toString()) {
        this.error = error
    }

    /**
     * Creates a BadRequestException with a functional error with the given code, and no parameter
     */
    constructor(errorCode: ErrorCode) : super(errorCode.toString()) {
        this.error = FunctionalError(errorCode, emptyMap())
    }

    /**
     * Creates a BadRequestException with a functional error with the given code, and a single parameter
     */
    constructor(errorCode: ErrorCode, parameterName: String, parameterValue: Any) : super(errorCode.toString()) {
        this.error = FunctionalError(errorCode, Collections.singletonMap(parameterName, parameterValue))
    }
}
