package org.globe42.web.security

import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.PersonDao
import org.globe42.dao.UserDao
import org.globe42.web.persons.PersonController
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * Test for the integration of the authentication filter in the application
 * @author JB Nizet
 */
@ExtendWith(SpringExtension::class)
@WebMvcTest(PersonController::class, AuthenticationConfig::class)
class AuthenticationTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @MockBean
    private lateinit var mockCoupleDao: CoupleDao

    @MockBean
    private lateinit var mockCountryDao: CountryDao

    @MockBean
    private lateinit var mockUserDao: UserDao

    @MockBean
    private lateinit var mockJwtHelper: JwtHelper

    @MockBean
    private lateinit var mockCurrentUser: CurrentUser

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun `should get unauthorized error`() {
        mvc.perform(get("/api/persons"))
                .andExpect(status().isUnauthorized)
    }
}