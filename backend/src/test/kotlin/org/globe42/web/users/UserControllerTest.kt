package org.globe42.web.users

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.globe42.web.security.PasswordDigester
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

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
class UserControllerTest {
    private val mockCurrentUser = mockk<CurrentUser>()

    private val mockUserDao = mockk<UserDao>()

    private val mockPasswordGenerator = mockk<PasswordGenerator>()

    private val mockPasswordDigester = mockk<PasswordDigester>()

    private val controller = UserController(mockCurrentUser, mockUserDao, mockPasswordGenerator, mockPasswordDigester)

    private val userId = 42L

    @BeforeEach
    fun prepare() {
        every { mockCurrentUser.userId } returns userId
    }

    @Test
    fun `should get current user`() {
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        val (id, login) = controller.getCurrentUser()
        assertThat(id).isEqualTo(user.id)
        assertThat(login).isEqualTo(user.login)
    }

    @Test
    fun `should throw when getting current user if not found`() {
        every { mockUserDao.findNotDeletedById(userId) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.getCurrentUser() }
    }

    @Test
    fun `should change password of current user`() {
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        val command = ChangePasswordCommandDTO("newPassword")
        every { mockPasswordDigester.hash(command.newPassword) } returns "hashed"

        controller.changePassword(command)

        assertThat(user.password).isEqualTo("hashed")
    }

    @Test
    fun `should list`() {
        val user = createUser(userId)
        every { mockUserDao.findNotDeleted() } returns listOf(user)

        val result = controller.list()
        assertThat(result).hasSize(1)
        assertThat(result[0].id).isEqualTo(user.id)
        assertThat(result[0].login).isEqualTo(user.login)
    }

    @Test
    fun `should get`() {
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        val (id) = controller.get(userId)
        assertThat(id).isEqualTo(user.id)
    }

    @Test
    fun `should throw when getting if not found`() {
        every { mockUserDao.findNotDeletedById(userId) } returns null
        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.get(userId) }
    }

    @Test
    fun `should create`() {
        val command = UserCommandDTO("test", true)

        every { mockUserDao.existsByLogin(command.login) } returns false
        every { mockPasswordGenerator.generatePassword() } returns "password"
        every { mockPasswordDigester.hash("password") } returns "hashed"
        every { mockUserDao.save(any<User>()) } answers { arg<User>(0).apply { id = 42L } }

        val (user, generatedPassword) = controller.create(command)
        assertThat(generatedPassword).isEqualTo("password")
        assertThat(user.login).isEqualTo(command.login)
        assertThat(user.admin).isEqualTo(command.admin)

        verify {
            mockUserDao.save(withArg<User> {
                assertThat(it.password).isEqualTo("hashed")
            })
        }
    }

    @Test
    fun `should throw when creating with existing login`() {
        val command = UserCommandDTO("test", false)

        every { mockUserDao.existsByLogin(command.login) } returns true

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.create(command) }
    }

    @Test
    fun `should update`() {
        val command = UserCommandDTO("test", true)
        val user = createUser(userId)

        every { mockUserDao.findNotDeletedByLogin(command.login) } returns null
        every { mockUserDao.findNotDeletedById(userId) } returns user

        controller.update(userId, command)
        assertThat(user.login).isEqualTo(command.login)
        assertThat(user.admin).isEqualTo(command.admin)
    }

    @Test
    fun `should throw when updating with existing login`() {
        val command = UserCommandDTO("test", false)
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        every { mockUserDao.findNotDeletedByLogin(command.login) } returns createUser(4567L)

        assertThatExceptionOfType(BadRequestException::class.java).isThrownBy { controller.update(userId, command) }
    }

    @Test
    fun `should not throw when updating with same login`() {
        val user = createUser(userId)
        val command = UserCommandDTO(user.login, false)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        every { mockUserDao.findNotDeletedByLogin(command.login) } returns user

        controller.update(userId, command)
    }

    @Test
    fun `should delete`() {
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        controller.delete(userId)

        assertThat(user.deleted).isTrue()
    }

    @Test
    fun `should not do anything when deleting unexisting user`() {
        every { mockUserDao.findNotDeletedById(userId) } returns null

        controller.delete(userId)

        verify(inverse = true) { mockUserDao.delete(any()) }
    }

    @Test
    fun `should reset password`() {
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        every { mockPasswordGenerator.generatePassword() } returns "password"
        every { mockPasswordDigester.hash("password") } returns "hashed"
        val (_, generatedPassword) = controller.resetPassword(userId)

        assertThat(user.password).isEqualTo("hashed")
        assertThat(generatedPassword).isEqualTo("password")
    }
}
