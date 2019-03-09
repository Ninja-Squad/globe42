package org.globe42.web.security

import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.whenever
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.UserDao
import org.globe42.web.exception.ForbiddenException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.EnableAspectJAutoProxy

/**
 * Integration test to verify that calling a method annotated with [AdminOnly] while not being an admin
 * indeed triggers the aspect and throws an exception
 * @author JB Nizet
 */
@SpringBootTest
class AdminOnlyIntegrationTest {

    @Autowired
    private lateinit var mockCurrentUser: CurrentUser

    @Autowired
    private lateinit var mockUserDao: UserDao

    @Autowired
    private lateinit var adminOnlyTester: AdminOnlyTester

    @BeforeEach
    fun prepare() {
        val userId = 42L
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.existsNotDeletedAdminById(userId)).thenReturn(false)
    }

    @Test
    fun `should throw when calling admin only annotated method`() {
        assertThatExceptionOfType(ForbiddenException::class.java).isThrownBy { adminOnlyTester.foo() }
    }

    @Test
    fun `should not throw when calling not annotated method`() {
        adminOnlyTester.bar()
    }

    open class AdminOnlyTester {
        @AdminOnly
        open fun foo() {
        }

        open fun bar() {}
    }

    @Configuration
    @EnableAspectJAutoProxy
    class AlternateConfiguration {
        @Bean
        fun adminOnlyTester() = AdminOnlyTester()

        @Bean
        fun currentUser() = mock<CurrentUser>()

        @Bean
        fun userDao() = mock<UserDao>()

        @Bean
        fun adminOnlyAspect() = AdminOnlyAspect(currentUser(), userDao())
    }
}
