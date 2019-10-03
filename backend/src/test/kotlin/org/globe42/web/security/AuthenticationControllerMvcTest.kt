package org.globe42.web.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.UserDao
import org.globe42.test.GlobeMvcTest
import org.globe42.web.jsonValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
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
    @MockBean
    private lateinit var mockUserDao: UserDao

    @MockBean
    private lateinit var mockPasswordDigester: PasswordDigester

    @MockBean
    private lateinit var mockJwtHelper: JwtHelper

    @Test
    fun `should authenticate`() {
        val credentials = createCredentials()

        val user = createUser()
        whenever(mockUserDao.findNotDeletedByLogin(credentials.login)).thenReturn(user)
        whenever(mockPasswordDigester.match(credentials.password, user.password)).thenReturn(true)
        val token = "token"
        whenever(mockJwtHelper.buildToken(user.id)).thenReturn(token)

        mvc.post("/api/authentication") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(credentials)
        }.andExpect {
            status { isOk }
            jsonValue("$.login", user.login)
            jsonValue("$.admin", user.admin)
            jsonValue("$.token", token)
        }
    }
}
