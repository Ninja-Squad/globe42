package org.globe42.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;

/**
 * Unit tests for Person
 * @author JB Nizet
 */
public class PersonTest {

    @Test
    public void shouldValidateFiscalNumber() {
        Pattern pattern = Pattern.compile(Person.FISCAL_NUMBER_REGEXP);

        assertThat(pattern.matcher("1abcdefghijk3").matches()).isFalse();
        assertThat(pattern.matcher("123456789012").matches()).isFalse();
        assertThat(pattern.matcher("12345678901234").matches()).isFalse();
        assertThat(pattern.matcher("1234567890123").matches()).isTrue();
    }
}
