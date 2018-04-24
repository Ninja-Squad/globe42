package org.globe42.web.security

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.test.BaseTest
import org.globe42.web.exception.UnauthorizedException
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import java.util.*

/**
 * Unit tests for AuthenticationController
 * @author JB Nizet
 */
class AuthenticationControllerTest : BaseTest() {
    @Mock
    private lateinit var mockUserDao: UserDao

    @Mock
    private lateinit var mockPasswordDigester: PasswordDigester

    @Mock
    private lateinit var mockJwtHelper: JwtHelper

    @InjectMocks
    private lateinit var controller: AuthenticationController

    @Test
    fun shouldThrowWhenUnknownUser() {
        val credentials = createCredentials()

        whenever(mockUserDao.findNotDeletedByLogin(credentials.login)).thenReturn(Optional.empty())

        assertThatExceptionOfType(UnauthorizedException::class.java).isThrownBy { controller.authenticate(credentials) }
    }

    @Test
    fun shouldThrowWhenPasswordDoesntMatch() {
        val credentials = createCredentials()

        val user = createUser()
        whenever(mockUserDao.findNotDeletedByLogin(credentials.login)).thenReturn(Optional.of(user))
        whenever(mockPasswordDigester.match(credentials.password, user.password)).thenReturn(false)

        assertThatExceptionOfType(UnauthorizedException::class.java).isThrownBy { controller.authenticate(credentials) }
    }

    @Test
    fun shouldAuthenticate() {
        val credentials = createCredentials()

        val user = createUser()
        whenever(mockUserDao.findNotDeletedByLogin(credentials.login)).thenReturn(Optional.of(user))
        whenever(mockPasswordDigester.match(credentials.password, user.password)).thenReturn(true)
        val token = "token"
        whenever(mockJwtHelper.buildToken(user.id)).thenReturn(token)
        val result = controller.authenticate(credentials)

        assertThat(result.id).isEqualTo(user.id)
        assertThat(result.login).isEqualTo(user.login)
        assertThat(result.admin).isEqualTo(user.admin)
        assertThat(result.token).isEqualTo(token)
    }
}

internal fun createCredentials(): CredentialsDTO {
    return CredentialsDTO("JB", "passw0rd")
}

internal fun createUser(): User {
    val user = User(1L)
    user.login = "JB"
    user.password = "hashedPassword"
    user.admin = true
    return user
}
