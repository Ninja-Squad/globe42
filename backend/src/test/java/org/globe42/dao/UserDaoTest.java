package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
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
            .columns("id", "login", "password")
            .values(1L, "jb", "hashedPassword")
            .build();

        dbSetup(users);
    }

    @Test
    public void shouldFindByLogin() {
        TRACKER.skipNextLaunch();
        assertThat(userDao.findByLogin("jb")).isNotEmpty();
        assertThat(userDao.findByLogin("ced")).isEmpty();
    }
}
