package org.globe42.web.users;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * Unit tests for {@link PasswordGenerator}
 * @author JB Nizet
 */
public class PasswordGeneratorTest {
    @Test
    public void shouldGenerate() {
        PasswordGenerator passwordGenerator = new PasswordGenerator();

        String p1 = passwordGenerator.generatePassword();
        String p2 = passwordGenerator.generatePassword();
        assertThat(p1).hasSize(8);
        assertThat(p2).hasSize(8);
        assertThat(p1).isNotEqualTo(p2);
    }
}
