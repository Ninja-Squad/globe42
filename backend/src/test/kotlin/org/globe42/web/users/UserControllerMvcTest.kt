package org.globe42.web.users

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.test.jsonValue
import org.globe42.web.security.CurrentUser
import org.globe42.web.security.PasswordDigester
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
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
    @MockBean
    private lateinit var mockCurrentUser: CurrentUser

    @MockBean
    private lateinit var mockUserDao: UserDao

    @MockBean
    private lateinit var mockPasswordGenerator: PasswordGenerator

    @MockBean
    private lateinit var mockPasswordDigester: PasswordDigester

    @Test
    fun `should get current user`() {
        val userId = 42L
        val user = createUser(userId)
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(user)

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
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(user)
        whenever(mockPasswordDigester.hash("newPassword")).thenReturn("hashedNewPassword")

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
        whenever(mockUserDao.findNotDeleted()).thenReturn(listOf(user))

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

        whenever(mockPasswordGenerator.generatePassword()).thenReturn("password")
        whenever(mockPasswordDigester.hash("password")).thenReturn("hashed")
        whenever(mockUserDao.save(any<User>()))
            .thenReturnModifiedFirstArgument<User> { it.id = 42L }

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
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(user)

        val command = UserCommandDTO("test", true)

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
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(user)

        mvc.delete("/api/users/{userId}", user.id).andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should reset password`() {
        val userId = 42L
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(user)

        whenever(mockPasswordGenerator.generatePassword()).thenReturn("password")
        whenever(mockPasswordDigester.hash("password")).thenReturn("hashed")

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
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(user)

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
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(user)

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
