package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninja_squad.dbsetup.Operations;
import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests for {@link IncomeSourceDao}
 * @author JB Nizet
 */
public class IncomeSourceDaoTest extends BaseDaoTest {

    @Autowired
    private IncomeSourceDao dao;

    @BeforeEach
    public void prepare() {
        Operation incomeSourceType =
            Insert.into("income_source_type")
                .columns("id", "type")
                .values(1L, "pension")
                .build();

        Operation incomeSource =
            Insert.into("income_source")
                  .columns("id", "type_id", "name", "max_monthly_amount")
                  .values(1L, 1L, "agirc", 5000.55)
                  .build();

        dbSetup(Operations.sequenceOf(incomeSourceType, incomeSource));
    }

    @Test
    public void shouldFindIfExistsByName() {
        TRACKER.skipNextLaunch();
        assertThat(dao.existsByName("hello")).isFalse();
        assertThat(dao.existsByName("agirc")).isTrue();
    }

    @Test
    public void shouldFindByName() {
        TRACKER.skipNextLaunch();
        assertThat(dao.findByName("hello")).isEmpty();
        assertThat(dao.findByName("agirc")).isNotEmpty();
    }
}
