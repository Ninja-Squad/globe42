package org.globe42.web.users

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.test.GlobeMvcTest
import org.globe42.web.security.CurrentUser
import org.globe42.web.security.PasswordDigester
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.*

/**
 * MVC test for [UserController]
 * @author JB Nizet
 */
@GlobeMvcTest(UserController::class)
class UserControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean
    private lateinit var mockCurrentUser: CurrentUser

    @MockkBean
    private lateinit var mockUserDao: UserDao

    @MockkBean
    private lateinit var mockPasswordGenerator: PasswordGenerator

    @MockkBean
    private lateinit var mockPasswordDigester: PasswordDigester

    @Test
    fun `should get current user`() {
        val userId = 42L
        val user = createUser(userId)
        every { mockCurrentUser.userId } returns userId
        every { mockUserDao.findNotDeletedById(userId) } returns user

        mvc.get("/api/users/me").andExpect {
            status { isOk }
            jsonValue("$.id", user.id!!)
            jsonValue("$.login", user.login)
            jsonPath("$.password") { doesNotExist() }
        }
    }

    @Test
    fun `should change password of current user`() {
        val userId = 42L
        val user = createUser(userId)
        every { mockCurrentUser.userId } returns userId
        every { mockUserDao.findNotDeletedById(userId) } returns user
        every { mockPasswordDigester.hash("newPassword") } returns "hashedNewPassword"

        val command = ChangePasswordCommandDTO("newPassword")

        mvc.put("/api/users/me/passwords") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should list`() {
        val user = createUser(42L)
        every { mockUserDao.findNotDeleted() } returns listOf(user)

        mvc.get("/api/users").andExpect {
            status { isOk }
            jsonValue("$[0].id", user.id!!)
            jsonValue("$[0].login", user.login)
            jsonPath("$[0].password") { doesNotExist() }
        }
    }

    @Test
    fun `should create`() {
        val command = UserCommandDTO("test", true)

        every { mockUserDao.existsByLogin(command.login) } returns false
        every { mockPasswordGenerator.generatePassword() } returns "password"
        every { mockPasswordDigester.hash("password") } returns "hashed"
        every { mockUserDao.save(any<User>()) } answers { arg<User>(0).apply { id = 42L } }

        mvc.post("/api/users") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.login", command.login)
            jsonValue("$.generatedPassword", "password")
        }
    }

    @Test
    fun `should update`() {
        val userId = 42L
        val user = createUser(userId)

        val command = UserCommandDTO("test", true)

        every { mockUserDao.findNotDeletedByLogin(command.login) } returns null
        every { mockUserDao.findNotDeletedById(userId) } returns user

        mvc.put("/api/users/{userId}", user.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should delete`() {
        val userId = 42L
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        mvc.delete("/api/users/{userId}", user.id).andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should reset password`() {
        val userId = 42L
        val user = createUser(userId)
        every { mockUserDao.findNotDeletedById(userId) } returns user

        every { mockPasswordGenerator.generatePassword() } returns "password"
        every { mockPasswordDigester.hash("password") } returns "hashed"

        mvc.post("/api/users/{userId}/password-resets", user.id).andExpect {
            status { isCreated }
            jsonValue("$.login", user.login)
            jsonValue("$.generatedPassword", "password")
        }
    }

    @Test
    fun `should get profile`() {
        val userId = 42L
        val user = createUser(userId)
        every { mockCurrentUser.userId } returns userId
        every { mockUserDao.findNotDeletedById(userId) } returns user

        mvc.get("/api/users/me/profile").andExpect {
            status { isOk }
            jsonValue("$.login", user.login)
            jsonValue("$.admin", user.admin)
            jsonValue("$.email", user.email!!)
            jsonValue("$.taskAssignmentEmailNotificationEnabled", user.taskAssignmentEmailNotificationEnabled)
        }
    }

    @Test
    fun `should update profile`() {
        val userId = 42L
        val user = createUser(userId)
        every { mockCurrentUser.userId } returns userId
        every { mockUserDao.findNotDeletedById(userId) } returns user

        val command = ProfileCommandDTO(
            email = "jb@bar.com",
            taskAssignmentEmailNotificationEnabled = true
        )

        mvc.put("/api/users/me/profile") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isNoContent }
        }
        assertThat(user.email).isEqualTo(command.email)
        assertThat(user.taskAssignmentEmailNotificationEnabled).isEqualTo(command.taskAssignmentEmailNotificationEnabled)
    }
}
