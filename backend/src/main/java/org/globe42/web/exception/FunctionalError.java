package org.globe42.web.exception;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A functional error, sent as part of an error response body.
 * @author JB Nizet
 */
public class FunctionalError {

    /**
     * The code of the error
     */
    private final ErrorCode code;

    /**
     * The parameters of the error. The values can be of any type, but must be serializable to JSON. They should most
     * of the time be simple strings or numbers.
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final Map<String, Object> parameters;

    public FunctionalError(ErrorCode code, Map<String, Object> parameters) {
        this.code = code;
        this.parameters = parameters;
    }

    public ErrorCode getCode() {
        return code;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }
}
