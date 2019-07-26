package org.globe42.web.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.UserDao
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * Unit tests for AuthenticationController
 * @author JB Nizet
 */
@GlobeMvcTest(AuthenticationController::class)
class AuthenticationControllerMvcTest {
    @MockBean
    private lateinit var mockUserDao: UserDao

    @MockBean
    private lateinit var mockPasswordDigester: PasswordDigester

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockBean
    private lateinit var mockJwtHelper: JwtHelper

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun `should authenticate`() {
        val credentials = createCredentials()

        val user = createUser()
        whenever(mockUserDao.findNotDeletedByLogin(credentials.login)).thenReturn(user)
        whenever(mockPasswordDigester.match(credentials.password, user.password)).thenReturn(true)
        val token = "token"
        whenever(mockJwtHelper.buildToken(user.id)).thenReturn(token)

        mvc.perform(
            post("/api/authentication")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(credentials))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.login").value(user.login))
            .andExpect(jsonPath("$.admin").value(user.admin))
            .andExpect(jsonPath("$.token").value(token))
    }
}
