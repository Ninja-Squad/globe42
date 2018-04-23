package org.globe42.web.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.security.NoSuchAlgorithmException
import java.util.*
import javax.crypto.KeyGenerator

val SIGNATURE_ALGORITHM = SignatureAlgorithm.HS256

/**
 * Helper class to build a JWT token or extract the claim from a token.
 * @author JB Nizet
 */
@Component
class JwtHelper(@param:Value("\${globe42.secretKey}") private val secretKey: String) {

    /**
     * Builds a token fot the user
     *
     * @param userId - the user ID
     * @return a JWT token as a String
     */
    fun buildToken(userId: Long?): String {
        return Jwts.builder()
            .setSubject(userId!!.toString())
            .signWith(SIGNATURE_ALGORITHM, secretKey).compact()
    }

    /**
     * Extracts the claim from the JWT token
     *
     * @param token - token to analyze
     * @return the Claims contained in the token
     */
    fun extractClaims(token: String): Claims {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).body
    }

    companion object {
        /**
         * Allows generating a real secret key
         */
        @Throws(NoSuchAlgorithmException::class)
        @JvmStatic
        fun main(args: Array<String>) {
            val keyGenerator = KeyGenerator.getInstance(SIGNATURE_ALGORITHM.jcaName)
            val secretKey = keyGenerator.generateKey()
            println(Base64.getEncoder().encodeToString(secretKey.encoded))
        }
    }
}
