package org.globe42.dao;

import static org.assertj.core.api.Java6Assertions.assertThat;

import java.util.Arrays;
import java.util.List;

import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.PostalCity;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests for {@link PostalCityDao}
 * @author JB Nizet
 */
public class PostalCityDaoTest extends BaseDaoTest {
    @Autowired
    private PostalCityDao dao;

    @Before
    public void prepare() {
        Operation person =
            Insert.into("postal_city")
                  .columns("id", "postal_code", "city")
                  .values(1L, "01160", "PONT D AIN")
                  .values(2L, "42000", "ST ETIENNE")
                  .values(3L, "42100", "ST ETIENNE")
                  .values(4L, "08310", "ST ETIENNE A ARNES")
                  .build();
        dbSetup(person);
    }

    @Test
    public void shouldFindByPostalCode() {
        TRACKER.skipNextLaunch();
        List<PostalCity> result = dao.findByPostalCode("42", 10);
        assertThat(result).extracting(PostalCity::getId).containsExactly(2L, 3L);

        result = dao.findByPostalCode("0", 1);
        assertThat(result).extracting(PostalCity::getId).containsExactly(1L);
    }

    @Test
    public void shouldFindByCity() {
        TRACKER.skipNextLaunch();
        List<PostalCity> result = dao.findByCity("Saint   étienne", 10);
        assertThat(result).extracting(PostalCity::getId).containsExactly(2L, 3L, 4L);

        result = dao.findByCity("Pont d'ain", 10);
        assertThat(result).extracting(PostalCity::getId).containsExactly(1L);

        result = dao.findByCity("Saint   étienne", 1);
        assertThat(result).extracting(PostalCity::getId).containsExactly(2L);
    }

    @Test
    public void shouldSaveEfficiently() {
        List<PostalCity> list = Arrays.asList(
            new PostalCity("69000", "LYON"),
            new PostalCity("42170", "ST JUST ST RAMBERT")
        );
        dao.saveAllEfficiently(list);

        assertThat(dao.findByPostalCode("69", 10)).hasSize(1);
    }
}