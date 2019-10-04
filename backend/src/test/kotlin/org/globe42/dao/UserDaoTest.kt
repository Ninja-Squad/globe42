package org.globe42.dao

import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.User
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

/**
 * Tests for [UserDao]
 * @author JB Nizet
 */
class UserDaoTest : BaseDaoTest() {

    @Autowired
    private lateinit var userDao: UserDao

    @BeforeEach
    fun prepare() {
        setup {
            insertInto("guser") {
                withDefaultValue("task_assignment_email_notification_enabled", false)
                columns("id", "login", "password", "admin", "deleted")
                values(1L, "jb", "hashedPassword", true, false)
                values(2L, "old", "hashedPassword", true, true)
                values(3L, "notadmin", "hashedPassword", false, false)
            }
        }
    }

    @Test
    fun `should find not deleted`() {
        skipNextLaunch()
        assertThat(userDao.findNotDeleted()).extracting<Long>(User::id).containsOnly(1L, 3L)
    }

    @Test
    fun `should find not deleted by login`() {
        skipNextLaunch()
        assertThat(userDao.findNotDeletedByLogin("jb")).isNotNull
        assertThat(userDao.findNotDeletedByLogin("old")).isNull()
        assertThat(userDao.findNotDeletedByLogin("ced")).isNull()
    }

    @Test
    fun `should exist by login`() {
        skipNextLaunch()
        assertThat(userDao.existsByLogin("jb")).isTrue()
        assertThat(userDao.existsByLogin("ced")).isFalse()
        assertThat(userDao.existsByLogin("old")).isTrue()
    }

    @Test
    fun `should find not deleted by id`() {
        skipNextLaunch()
        assertThat(userDao.findNotDeletedById(1L)).isNotNull
        assertThat(userDao.findNotDeletedById(2L)).isNull()
        assertThat(userDao.findNotDeletedById(1234L)).isNull()
    }

    @Test
    fun `should exists not deleted by id`() {
        skipNextLaunch()
        assertThat(userDao.existsNotDeletedById(1L)).isTrue()
        assertThat(userDao.existsNotDeletedById(2L)).isFalse()
        assertThat(userDao.existsNotDeletedById(3L)).isTrue()
        assertThat(userDao.existsNotDeletedById(1234L)).isFalse()
    }

    @Test
    fun `should exists not deleted admin by id`() {
        skipNextLaunch()
        assertThat(userDao.existsNotDeletedAdminById(1L)).isTrue()
        assertThat(userDao.existsNotDeletedAdminById(2L)).isFalse()
        assertThat(userDao.existsNotDeletedAdminById(3L)).isFalse()
        assertThat(userDao.existsNotDeletedAdminById(1234L)).isFalse()
    }
}
