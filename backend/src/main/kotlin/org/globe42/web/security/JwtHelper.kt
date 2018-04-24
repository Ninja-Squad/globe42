package org.globe42.web.security;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Helper class to build a JWT token or extract the claim from a token.
 * @author JB Nizet
 */
@Component
public class JwtHelper {

    public static final SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS256;

    private final String secretKey;

    public JwtHelper(@Value("${globe42.secretKey}") String secretKey) {
        this.secretKey = secretKey;
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
                   .signWith(SIGNATURE_ALGORITHM, secretKey).compact();
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

    /**
     * Allows generating a real secret key
     */
    public static void main(String[] args) throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(SIGNATURE_ALGORITHM.getJcaName());
        SecretKey secretKey = keyGenerator.generateKey();
        System.out.println(Base64.getEncoder().encodeToString(secretKey.getEncoded()));
    }
}
