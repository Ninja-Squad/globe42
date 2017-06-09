package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.Gender;
import org.globe42.domain.Person;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests for {@link PersonDao}
 * @author JB Nizet
 */
public class PersonDaoTest extends BaseDaoTest {
    @Autowired
    private PersonDao personDao;

    @Before
    public void prepare() {
        Operation person =
            Insert.into("person")
                .columns("id", "nick_name", "gender", "adherent", "entry_date")
                .values(1L, "Ced", Gender.MALE, true, "2017-01-01")
                .build();
        dbSetup(person);
    }

    @Test
    public void shouldInsert() {
        Person person = new Person();
        person.setGender(Gender.MALE);
        person.setNickName("JB");

        personDao.save(person);
        personDao.flush();
    }

    @Test
    public void shouldFindById() {
        TRACKER.skipNextLaunch();
        assertThat(personDao.findById(1L)).hasValueSatisfying(p -> {
            assertThat(p.getId()).isEqualTo(1L);
            assertThat(p.getEntryDate()).isEqualTo("2017-01-01");
        });
    }

    @Test
    public void shouldFindIfExistsByNickName() {
        TRACKER.skipNextLaunch();
        assertThat(personDao.existsByNickName("hello")).isFalse();
        assertThat(personDao.existsByNickName("Ced")).isTrue();
    }

    @Test
    public void shouldFindByNickName() {
        TRACKER.skipNextLaunch();
        assertThat(personDao.findByNickName("hello")).isEmpty();
        assertThat(personDao.findByNickName("Ced")).isNotEmpty();
    }
}
