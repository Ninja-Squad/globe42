package org.globe42.web.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

/**
 * TODO include class javadoc here
 * @author JB Nizet
 */
@Component
public class JwtHelper {

    public static final String DEFAULT_SECRET_KEY = "ng2ponyracerByNinjaSqu4d!";

    private final String secretKey;

    public JwtHelper(String secretKey) {
        this.secretKey = secretKey;
    }

    public JwtHelper() {
        this(DEFAULT_SECRET_KEY);
    }

    /**
     * Builds a token fot the user
     *
     * @param userId - the user ID
     * @return a JWT token as a String
     */
    public String buildToken(Long userId) {
        return Jwts.builder()
                   .setSubject(userId.toString())
                   .signWith(SignatureAlgorithm.HS256, secretKey).compact();
    }

    /**
     * Extracts the claim from the JWT token
     *
     * @param token - token to analyze
     * @return the Claims contained in the token
     */
    public Claims extractClaims(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }
}
