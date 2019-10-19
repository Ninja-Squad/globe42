package org.globe42.web.security

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.web.exception.ForbiddenException
import org.junit.jupiter.api.Test

/**
 * Unit tests for [AdminOnlyAspect]
 * @author JB Nizet
 */
class AdminOnlyAspectTest {
    private val mockCurrentUser = mockk<CurrentUser>()

    private val mockUserDao = mockk<UserDao>()

    private val aspect = AdminOnlyAspect(mockCurrentUser, mockUserDao)

    @Test
    fun `should throw if no current user or current user not admin`() {
        val userId = 42L
        every { mockCurrentUser.userId } returns userId
        every { mockUserDao.existsNotDeletedAdminById(userId) } returns false

        assertThatExceptionOfType(ForbiddenException::class.java)
            .isThrownBy { aspect.checkUserIsAdmin(null) }
    }

    @Test
    fun `should not throw if current user is admin`() {
        val userId = 42L
        every { mockCurrentUser.userId } returns userId
        val user = User(userId)
        user.admin = true

        every { mockUserDao.existsNotDeletedAdminById(userId) } returns true

        aspect.checkUserIsAdmin(null)
    }
}
