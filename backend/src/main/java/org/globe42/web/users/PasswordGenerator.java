package org.globe42.web.users;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import org.springframework.stereotype.Component;

/**
 * A random password generator
 * @author JB Nizet
 */
@Component
public class PasswordGenerator {

    /**
     * The size of generated passwords
     */
    private static final int SIZE = 8;

    /**
     * The characters composing generated passwords. The generators picks randomly in these characters.
     */
    private static final char[] CHARACTERS =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_$%?/+=.<>#*".toCharArray();

    private SecureRandom random;

    public PasswordGenerator() {
        try {
            random = SecureRandom.getInstance("SHA1PRNG");
        }
        catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    public String generatePassword() {
        StringBuilder builder = new StringBuilder(SIZE);
        for (int i = 0; i < SIZE; i++) {
            builder.append(CHARACTERS[random.nextInt(CHARACTERS.length)]);
        }
        return builder.toString();
    }
}
