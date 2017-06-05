package org.globe42.web.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;

/**
 * Unit tests for {@link PasswordDigester}
 * @author JB Nizet
 */
public class PasswordDigesterTest {
    @Test
    public void hashedPasswordShouldMatch() {
        String password = "password";
        PasswordDigester digester = new PasswordDigester();
        String hash = digester.hash(password);
        assertThat(digester.match(password, hash)).isTrue();
    }

    @Test
    public void passwordShouldNotMatchWithNullHashedPassword() {
        PasswordDigester digester = new PasswordDigester();
        assertThat(digester.match("foobar", null)).isFalse();
    }

    @Test
    public void badPasswordShouldNotMatch() {
        String password = "password";
        PasswordDigester digester = new PasswordDigester();
        assertThat(digester.match("badPassword", digester.hash(password)));
    }

    @Test
    public void hashesShouldBeDifferentWithSamePassword() {
        String password = "password";
        PasswordDigester digester = new PasswordDigester();
        String hash1 = digester.hash(password);
        String hash2 = digester.hash(password);
        assertThat(hash1).isNotEqualTo(hash2);
    }
}
