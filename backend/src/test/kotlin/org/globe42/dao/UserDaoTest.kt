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
                columns("id", "login", "password", "admin", "deleted")
                values(1L, "jb", "hashedPassword", true, false)
                values(2L, "old", "hashedPassword", true, true)
                values(3L, "notadmin", "hashedPassword", false, false)
            }
        }
    }

    @Test
    fun shouldFindNotDeleted() {
        skipNextLaunch()
        assertThat(userDao.findNotDeleted()).extracting<Long>(User::id).containsOnly(1L, 3L)
    }

    @Test
    fun shouldFindNotDeletedByLogin() {
        skipNextLaunch()
        assertThat(userDao.findNotDeletedByLogin("jb")).isNotEmpty
        assertThat(userDao.findNotDeletedByLogin("old")).isEmpty
        assertThat(userDao.findNotDeletedByLogin("ced")).isEmpty
    }

    @Test
    fun shouldExistByLogin() {
        skipNextLaunch()
        assertThat(userDao.existsByLogin("jb")).isTrue()
        assertThat(userDao.existsByLogin("ced")).isFalse()
        assertThat(userDao.existsByLogin("old")).isTrue()
    }

    @Test
    fun shouldFindNotDeletedById() {
        skipNextLaunch()
        assertThat(userDao.findNotDeletedById(1L)).isNotEmpty
        assertThat(userDao.findNotDeletedById(2L)).isEmpty
        assertThat(userDao.findNotDeletedById(1234L)).isEmpty
    }

    @Test
    fun shouldExistsNotDeletedById() {
        skipNextLaunch()
        assertThat(userDao.existsNotDeletedById(1L)).isTrue()
        assertThat(userDao.existsNotDeletedById(2L)).isFalse()
        assertThat(userDao.existsNotDeletedById(3L)).isTrue()
        assertThat(userDao.existsNotDeletedById(1234L)).isFalse()
    }

    @Test
    fun shouldExistsNotDeletedAdminById() {
        skipNextLaunch()
        assertThat(userDao.existsNotDeletedAdminById(1L)).isTrue()
        assertThat(userDao.existsNotDeletedAdminById(2L)).isFalse()
        assertThat(userDao.existsNotDeletedAdminById(3L)).isFalse()
        assertThat(userDao.existsNotDeletedAdminById(1234L)).isFalse()
    }
}
