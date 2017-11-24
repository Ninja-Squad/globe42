package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests for {@link UserDao}
 * @author JB Nizet
 */
public class UserDaoTest extends BaseDaoTest {

    @Autowired
    private UserDao userDao;

    @Before
    public void prepare() {
        Operation users = Insert.into("guser")
            .columns("id", "login", "password", "admin", "deleted")
            .values(1L, "jb", "hashedPassword", true, false)
            .values(2L, "old", "hashedPassword", true, true)
            .build();

        dbSetup(users);
    }

    @Test
    public void shouldFindNotDeleted() {
        TRACKER.skipNextLaunch();
        assertThat(userDao.findNotDeleted()).extracting(User::getId).containsOnly(1L);
    }

    @Test
    public void shouldFindNotDeletedByLogin() {
        TRACKER.skipNextLaunch();
        assertThat(userDao.findNotDeletedByLogin("jb")).isNotEmpty();
        assertThat(userDao.findNotDeletedByLogin("old")).isEmpty();
        assertThat(userDao.findNotDeletedByLogin("ced")).isEmpty();
    }

    @Test
    public void shouldExistByLogin() {
        TRACKER.skipNextLaunch();
        assertThat(userDao.existsByLogin("jb")).isTrue();
        assertThat(userDao.existsByLogin("ced")).isFalse();
        assertThat(userDao.existsByLogin("old")).isTrue();
    }

    @Test
    public void shouldFindNotDeletedById() {
        TRACKER.skipNextLaunch();
        assertThat(userDao.findNotDeletedById(1L)).isNotEmpty();
        assertThat(userDao.findNotDeletedById(2L)).isEmpty();
        assertThat(userDao.findNotDeletedById(1234L)).isEmpty();
    }
}
