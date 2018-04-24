package org.globe42.web.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.entry;

import java.util.Collections;

import org.junit.jupiter.api.Test;

/**
 * Unit tests for {@link BadRequestException}
 * @author JB Nizet
 */
public class BadRequestExceptionTest {
    @Test
    public void shouldCreateWithMessage() {
        BadRequestException e = new BadRequestException("foo");

        assertThat(e.getError()).isNull();
        assertThat(e.getMessage()).isEqualTo("foo");
    }

    @Test
    public void shouldCreateWithErrorCode() {
        BadRequestException e = new BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS);

        assertThat(e.getMessage()).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString());
        assertThat(e.getError().getCode()).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS);
        assertThat(e.getError().getParameters()).isEmpty();
    }

    @Test
    public void shouldCreateWithErrorCodeAndParameter() {
        BadRequestException e = new BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS, "foo", "bar");

        assertThat(e.getMessage()).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString());
        assertThat(e.getError().getCode()).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS);
        assertThat(e.getError().getParameters()).containsOnly(entry("foo", "bar"));
    }

    @Test
    public void shouldCreateWithFunctionalError() {
        BadRequestException e = new BadRequestException(new FunctionalError(ErrorCode.USER_LOGIN_ALREADY_EXISTS,
                                                                            Collections.singletonMap("foo", "bar")));

        assertThat(e.getMessage()).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS.toString());
        assertThat(e.getError().getCode()).isEqualTo(ErrorCode.USER_LOGIN_ALREADY_EXISTS);
        assertThat(e.getError().getParameters()).containsOnly(entry("foo", "bar"));
    }
}
