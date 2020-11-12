package org.globe42.web.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.UserDao
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

/**
 * Unit tests for AuthenticationController
 * @author JB Nizet
 */
@GlobeMvcTest(AuthenticationController::class)
class AuthenticationControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean
    private lateinit var mockUserDao: UserDao

    @MockkBean
    private lateinit var mockPasswordDigester: PasswordDigester

    @MockkBean
    private lateinit var mockJwtHelper: JwtHelper

    @Test
    fun `should authenticate`() {
        val credentials = createCredentials()

        val user = createUser()
        every { mockUserDao.findNotDeletedByLogin(credentials.login) } returns user
        every { mockPasswordDigester.match(credentials.password, user.password) } returns true
        val token = "token"
        every { mockJwtHelper.buildToken(user.id) } returns token

        mvc.post("/api/authentication") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(credentials)
        }.andExpect {
            status { isOk() }
            jsonValue("$.login", user.login)
            jsonValue("$.admin", user.admin)
            jsonValue("$.token", token)
        }
    }
}
