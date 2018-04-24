package org.globe42.web.security

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.test.BaseTest
import org.globe42.web.exception.ForbiddenException
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock

/**
 * Unit tests for [AdminOnlyAspect]
 * @author JB Nizet
 */
class AdminOnlyAspectTest : BaseTest() {
    @Mock
    private lateinit var mockCurrentUser: CurrentUser

    @Mock
    private lateinit var mockUserDao: UserDao

    @InjectMocks
    private lateinit var aspect: AdminOnlyAspect

    @Test
    fun shouldThrowIfNoCurrentUserOrCurrentUserNotAdmin() {
        val userId = 42L
        whenever(mockCurrentUser.userId).thenReturn(userId)
        whenever(mockUserDao.existsNotDeletedAdminById(userId)).thenReturn(false)

        Assertions.assertThatExceptionOfType(ForbiddenException::class.java).isThrownBy { aspect.checkUserIsAdmin(null) }
    }

    @Test
    fun shouldNotThrowIfCurrentUserIsAdmin() {
        val userId = 42L
        whenever(mockCurrentUser.userId).thenReturn(userId)
        val user = User(userId)
        user.admin = true

        whenever(mockUserDao.existsNotDeletedAdminById(userId)).thenReturn(true)

        aspect.checkUserIsAdmin(null)
    }
}
