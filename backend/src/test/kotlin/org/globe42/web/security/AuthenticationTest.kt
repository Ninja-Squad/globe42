package org.globe42.web.security

import com.ninjasquad.springmockk.MockkBean
import org.globe42.dao.CountryDao
import org.globe42.dao.CoupleDao
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.dao.UserDao
import org.globe42.web.persons.PersonController
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * Test for the integration of the authentication filter in the application
 * @author JB Nizet
 */
@WebMvcTest(PersonController::class, AuthenticationConfig::class)
@MockkBean(
    PersonDao::class,
    CoupleDao::class,
    CountryDao::class,
    UserDao::class,
    JwtHelper::class,
    CurrentUser::class,
    MembershipDao::class,
    relaxUnitFun = true
)
class AuthenticationTest {
    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun `should get unauthorized error`() {
        mvc.perform(get("/api/persons"))
            .andExpect(status().isUnauthorized)
    }
}
