package org.globe42.web.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*

val SIGNATURE_ALGORITHM = SignatureAlgorithm.HS256

/**
 * Helper class to build a JWT token or extract the claim from a token.
 * @author JB Nizet
 */
@Component
class JwtHelper(@Value("\${globe42.secretKey}") secretKey: String) {

    private val key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey))

    /**
     * Builds a token fot the user
     *
     * @param userId - the user ID
     * @return a JWT token as a String
     */
    fun buildToken(userId: Long?): String {
        return Jwts.builder()
            .setSubject(userId!!.toString())
            .signWith(key)
            .compact()
    }

    /**
     * Extracts the claim from the JWT token
     *
     * @param token - token to analyze
     * @return the Claims contained in the token
     */
    fun extractClaims(token: String): Claims {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).body
    }

    companion object {
        /**
         * Allows generating a real secret key
         */
        @JvmStatic
        fun main(args: Array<String>) {
            println(Base64.getEncoder().encodeToString(Keys.secretKeyFor(SIGNATURE_ALGORITHM).encoded))
        }
    }
}
