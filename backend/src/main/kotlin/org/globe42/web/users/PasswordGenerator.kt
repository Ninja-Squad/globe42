package org.globe42.web.users

import org.springframework.stereotype.Component
import java.security.SecureRandom

/**
 * The size of generated passwords
 */
private val SIZE = 8

/**
 * The characters composing generated passwords. The generators picks randomly in these characters.
 */
private val CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_$%?/+=.<>#*".toCharArray()

/**
 * A random password generator
 * @author JB Nizet
 */
@Component
class PasswordGenerator {

    private val random: SecureRandom = SecureRandom.getInstance("SHA1PRNG")

    fun generatePassword(): String {
        val builder = StringBuilder(SIZE)
        for (i in 0 until SIZE) {
            builder.append(CHARACTERS[random.nextInt(CHARACTERS.size)])
        }
        return builder.toString()
    }
}
