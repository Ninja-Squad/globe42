package org.globe42.web.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

/**
 * Exception thrown to signal that a resource can't be found. Translated to a 404 HTTP status.
 * @author JB Nizet
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
class NotFoundException : RuntimeException {
    constructor()

    constructor(message: String) : super(message)
}
