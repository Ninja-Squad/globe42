package org.globe42.web.exception;

import java.util.Collections;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown to signal that a request is incorrect. Translated to a 400 HTTP status.
 * It contains an error containing a code and error parameters, that allows the backend to display a parameterized
 * error message when getting such an error response.
 * @author JB Nizet
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    private FunctionalError error;

    /**
     * Should be used seldomly: it doesn't add any functional error. This constructor is useful
     * to signal an error that is semantically a bad request, but which should theoretically never happen,
     * and should thus not lead to a functional error message being displayed.
     */
    public BadRequestException(String message) {
        super(message);
    }

    /**
     * Creates a BadRequestException with a functional error
     */
    public BadRequestException(FunctionalError error) {
        super(error.getCode().toString());
        this.error = error;
    }

    /**
     * Creates a BadRequestException with a functional error with the given code, and no parameter
     */
    public BadRequestException(ErrorCode errorCode) {
        super(errorCode.toString());
        this.error = new FunctionalError(errorCode, Collections.emptyMap());
    }

    /**
     * Creates a BadRequestException with a functional error with the given code, and a single parameter
     */
    public BadRequestException(ErrorCode errorCode, String parameterName, Object parameterValue) {
        super(errorCode.toString());
        this.error = new FunctionalError(errorCode, Collections.singletonMap(parameterName, parameterValue));
    }

    public FunctionalError getError() {
        return error;
    }
}
