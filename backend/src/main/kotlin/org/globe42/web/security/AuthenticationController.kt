package org.globe42.web.security

import org.globe42.dao.UserDao
import org.globe42.web.exception.UnauthorizedException
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.transaction.Transactional

/**
 * REST controller used to authenticate users
 * @author JB Nizet
 */
@RestController
@RequestMapping("/api/authentication")
@Transactional
class AuthenticationController(
    private val userDao: UserDao,
    private val passwordDigester: PasswordDigester,
    private val jwtHelper: JwtHelper
) {

    @PostMapping
    fun authenticate(@RequestBody credentials: CredentialsDTO): AuthenticatedUserDTO {
        val user = userDao.findNotDeletedByLogin(credentials.login).orElseThrow(::UnauthorizedException)
        if (!passwordDigester.match(credentials.password, user.password)) {
            throw UnauthorizedException()
        }

        return AuthenticatedUserDTO(user, jwtHelper.buildToken(user.id))
    }
}
