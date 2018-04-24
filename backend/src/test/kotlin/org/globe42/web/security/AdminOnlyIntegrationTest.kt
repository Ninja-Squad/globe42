package org.globe42.web.security

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.UserDao
import org.globe42.web.exception.ForbiddenException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.SpyBean
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.junit.jupiter.SpringExtension

/**
 * Integration test to verify that calling a method annotated with [AdminOnly] while not being an admin
 * indeed triggers the aspect and throws an exception
 * @author JB Nizet
 */
@SpringBootTest
@ExtendWith(SpringExtension::class)
@TestPropertySource("/test.properties")
class AdminOnlyIntegrationTest {

    @MockBean
    private lateinit var mockCurrentUser: CurrentUser

    @MockBean
    private lateinit var mockUserDao: UserDao

    @SpyBean
    private lateinit var adminOnlyTester: AdminOnlyTester

    @BeforeEach
    fun prepare() {
        val userId = 42L
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.existsNotDeletedAdminById(userId)).thenReturn(false)
    }

    @Test
    fun shouldThrowWhenCallingAdminOnlyAnnotatedMethod() {
        assertThatExceptionOfType(ForbiddenException::class.java).isThrownBy { adminOnlyTester.foo() }
    }

    @Test
    fun shouldNotThrowWhenCallingNotAnnotatedMethod() {
        adminOnlyTester.bar()
    }

    open class AdminOnlyTester {
        @AdminOnly
        open fun foo() {
        }

        open fun bar() {}
    }
}
