package org.globe42.web.security

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.web.exception.UnauthorizedException
import org.junit.jupiter.api.Test

/**
 * Unit tests for AuthenticationController
 * @author JB Nizet
 */
class AuthenticationControllerTest {
    private val mockUserDao = mockk<UserDao>()

    private val mockPasswordDigester = mockk<PasswordDigester>()

    private val mockJwtHelper = mockk<JwtHelper>()

    private val controller = AuthenticationController(mockUserDao, mockPasswordDigester, mockJwtHelper)

    @Test
    fun `should throw when unknown user`() {
        val credentials = createCredentials()

        every { mockUserDao.findNotDeletedByLogin(credentials.login) } returns null

        assertThatExceptionOfType(UnauthorizedException::class.java).isThrownBy { controller.authenticate(credentials) }
    }

    @Test
    fun `should throw when password doesnt match`() {
        val credentials = createCredentials()

        val user = createUser()
        every { mockUserDao.findNotDeletedByLogin(credentials.login) } returns user
        every { mockPasswordDigester.match(credentials.password, user.password) } returns false

        assertThatExceptionOfType(UnauthorizedException::class.java).isThrownBy { controller.authenticate(credentials) }
    }

    @Test
    fun `should authenticate`() {
        val credentials = createCredentials()

        val user = createUser()
        every { mockUserDao.findNotDeletedByLogin(credentials.login) } returns user
        every { mockPasswordDigester.match(credentials.password, user.password) } returns true
        val token = "token"
        every { mockJwtHelper.buildToken(user.id) } returns token
        val result = controller.authenticate(credentials)

        assertThat(result.id).isEqualTo(user.id)
        assertThat(result.login).isEqualTo(user.login)
        assertThat(result.admin).isEqualTo(user.admin)
        assertThat(result.token).isEqualTo(token)
    }
}

internal fun createCredentials(): CredentialsCommandDTO {
    return CredentialsCommandDTO("JB", "passw0rd")
}

internal fun createUser(): User {
    val user = User(1L)
    user.login = "JB"
    user.password = "hashedPassword"
    user.admin = true
    return user
}
