package org.globe42.web.users

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.security.CurrentUser
import org.globe42.web.security.PasswordDigester
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.*

/**
 * MVC test for [UserController]
 * @author JB Nizet
 */
@GlobeMvcTest(UserController::class)
class UserControllerMvcTest {
    @MockBean
    private lateinit var mockCurrentUser: CurrentUser

    @MockBean
    private lateinit var mockUserDao: UserDao

    @MockBean
    private lateinit var mockPasswordGenerator: PasswordGenerator

    @MockBean
    private lateinit var mockPasswordDigester: PasswordDigester

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun `should get current user`() {
        val userId = 42L
        val user = createUser(userId)
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        mvc.perform(get("/api/users/me"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(user.id!!))
            .andExpect(jsonPath("$.login").value(user.login))
            .andExpect(jsonPath("$.password").doesNotExist())
    }

    @Test
    fun `should change password of current user`() {
        val userId = 42L
        val user = createUser(userId)
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))
        whenever(mockPasswordDigester.hash("newPassword")).thenReturn("hashedNewPassword")

        val command = ChangePasswordCommandDTO("newPassword")

        mvc.perform(
            put("/api/users/me/passwords")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isNoContent)
    }

    @Test
    fun `should list`() {
        val user = createUser(42L)
        whenever(mockUserDao.findNotDeleted()).thenReturn(listOf(user))

        mvc.perform(get("/api/users"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(user.id!!))
            .andExpect(jsonPath("$[0].login").value(user.login))
            .andExpect(jsonPath("$[0].password").doesNotExist())
    }

    @Test
    fun `should create`() {
        val command = UserCommandDTO("test", true)

        whenever(mockPasswordGenerator.generatePassword()).thenReturn("password")
        whenever(mockPasswordDigester.hash("password")).thenReturn("hashed")
        whenever(mockUserDao.save(any<User>()))
            .thenReturnModifiedFirstArgument<User> { it.id = 42L }

        mvc.perform(
            post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.login").value(command.login))
            .andExpect(jsonPath("$.generatedPassword").value("password"))
    }

    @Test
    fun `should update`() {
        val userId = 42L
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        val command = UserCommandDTO("test", true)

        mvc.perform(
            put("/api/users/{userId}", user.id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(command))
        )
            .andExpect(status().isNoContent)
    }

    @Test
    fun `should delete`() {
        val userId = 42L
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        mvc.perform(delete("/api/users/{userId}", user.id))
            .andExpect(status().isNoContent)
    }

    @Test
    fun `should reset password`() {
        val userId = 42L
        val user = createUser(userId)
        whenever(mockUserDao.findNotDeletedById(userId)).thenReturn(Optional.of(user))

        whenever(mockPasswordGenerator.generatePassword()).thenReturn("password")
        whenever(mockPasswordDigester.hash("password")).thenReturn("hashed")

        mvc.perform(post("/api/users/{userId}/password-resets", user.id))
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.login").value(user.login))
            .andExpect(jsonPath("$.generatedPassword").value("password"))
    }
}
