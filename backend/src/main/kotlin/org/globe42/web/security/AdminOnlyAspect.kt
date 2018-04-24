package org.globe42.web.security

import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.globe42.dao.UserDao
import org.globe42.web.exception.ForbiddenException
import org.springframework.stereotype.Component

/**
 * Aspect allowing to check that the current user is an admin before invoking a controller method.
 * This aspect is installed by annotating a method with [AdminOnly]
 *
 * @author JB Nizet
 */
@Aspect
@Component
class AdminOnlyAspect(private val currentUser: CurrentUser, private val userDao: UserDao) {

    @Before("@annotation(adminOnly)")
    fun checkUserIsAdmin(adminOnly: AdminOnly?) {
        if (!userDao.existsNotDeletedAdminById(currentUser.userId!!)) {
            throw ForbiddenException()
        }
    }
}
