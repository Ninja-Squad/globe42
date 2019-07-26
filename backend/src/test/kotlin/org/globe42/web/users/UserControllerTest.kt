package org.globe42.web.users

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.never
import com.nhaarman.mockitokotlin2.verify
import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.test.Mockito
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.globe42.web.security.PasswordDigester
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.InjectMocks
import org.mockito.Mock
import java.util.*

fun createUser(id: Long): User {
    return User(id).apply {
        login = "JB"
        password = "hashedPassword"
        email = "jb@foo.com"
        taskAssignmentEmailNotificationEnabled = false
    }
}

/**
 * Unit tests for [UserController]
 * @author JB Nizet
 */
@Mockito
class UserControllerTest {
    @Mock
    private lateinit var mockCurrentUser: CurrentUser

    @Mock
    private lateinit var mockUserDao: UserDao

    @Mock
    private lateinit var mockPasswordGenerator: PasswordGenerator

    @Mock
    private lateinit var mockPasswordDigester: PasswordDigester

    @InjectMocks
    private lateinit var controller: UserController

    @Captor
    private lateinit var userCaptor: ArgumentCaptor<User>

    private val userId = 42L

    @BeforeEach
    fun prepare() {
        whenever(mockCurrentUser.userId).thenReturn(userId)
    }

    @Test
    fun `should get current user`() {
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        val (id, login) = controller.getCurrentUser()
        assertThat(id).isEqualTo(user.id)
        assertThat(login).isEqualTo(user.login)
    }

    @Test
    fun `should throw when getting current user if not found`() {
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.getCurrentUser() }
    }

    @Test
    fun `should change password of current user`() {
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        val command = ChangePasswordCommandDTO("newPassword")
        whenever(mockPasswordDigester.hash(command.newPassword)).thenReturn("hashed")

        controller.changePassword(command)

        assertThat(user.password).isEqualTo("hashed")
    }

    @Test
    fun `should list`() {
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeleted()).thenReturn(listOf(user))

        val result = controller.list()
        assertThat(result).hasSize(1)
        assertThat(result[0].id).isEqualTo(user.id)
        assertThat(result[0].login).isEqualTo(user.login)
    }

    @Test
    fun `should get`() {
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        val (id) = controller.get(userId)
        assertThat(id).isEqualTo(user.id)
    }

    @Test
    fun `should throw when getting if not found`() {
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.empty())
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(userId) }
    }

    @Test
    fun `should create`() {
        val command = UserCommandDTO("test", true)

        whenever(mockPasswordGenerator.generatePassword()).thenReturn("password")
        whenever(mockPasswordDigester.hash("password")).thenReturn("hashed")
        whenever(mockUserDao.save(any<User>()))
            .thenReturnModifiedFirstArgument<User> { it.id = 42L }

        val (user, generatedPassword) = controller.create(command)
        assertThat(generatedPassword).isEqualTo("password")
        assertThat(user.login).isEqualTo(command.login)
        assertThat(user.admin).isEqualTo(command.admin)

        verify(mockUserDao).save(userCaptor.capture())
        assertThat(userCaptor.value.password).isEqualTo("hashed")
    }

    @Test
    fun `should throw when creating with existing login`() {
        val command = UserCommandDTO("test", false)

        whenever(mockUserDao.existsByLogin(command.login)).thenReturn(true)

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should update`() {
        val command = UserCommandDTO("test", true)
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        controller.update(userId, command)
        assertThat(user.login).isEqualTo(command.login)
        assertThat(user.admin).isEqualTo(command.admin)
    }

    @Test
    fun `should throw when updating with existing login`() {
        val command = UserCommandDTO("test", false)
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        whenever(mockUserDao.findNotDeletedByLogin(command.login)).thenReturn(Optional.of(createUser(4567L)))

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.update(userId, command) }
    }

    @Test
    fun `should not throw when updating with same login`() {
        val user = createUser(userId)
        val command = UserCommandDTO(user.login, false)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        whenever(mockUserDao.findNotDeletedByLogin(command.login)).thenReturn(Optional.of(user))

        controller.update(userId, command)
    }

    @Test
    fun `should delete`() {
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        controller.delete(userId)

        assertThat(user.deleted).isTrue()
    }

    @Test
    fun `should not do anything when deleting unexisting user`() {
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.empty())

        controller.delete(userId)

        verify(mockUserDao, never()).delete(any())
    }

    @Test
    fun `should reset password`() {
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        whenever(mockPasswordGenerator.generatePassword()).thenReturn("password")
        whenever(mockPasswordDigester.hash("password")).thenReturn("hashed")
        val (_, generatedPassword) = controller.resetPassword(userId)

        assertThat(user.password).isEqualTo("hashed")
        assertThat(generatedPassword).isEqualTo("password")
    }
}
