package org.globe42.dao;

import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

import com.ninja_squad.dbsetup.DbSetup;
import com.ninja_squad.dbsetup.DbSetupTracker;
import com.ninja_squad.dbsetup.Operations;
import com.ninja_squad.dbsetup.destination.DataSourceDestination;
import com.ninja_squad.dbsetup.operation.DeleteAll;
import com.ninja_squad.dbsetup.operation.Operation;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Base class for DAO tests
 * @author JB Nizet
 */
@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource("/test.properties")
@Rollback(false)
public abstract class BaseDaoTest {
    protected static final DbSetupTracker TRACKER = new DbSetupTracker();

    private static final Operation DELETE_ALL = DeleteAll.from("person_note",
                                                               "note",
                                                               "task",
                                                               "guser",
                                                               "income",
                                                               "person",
                                                               "family_situation",
                                                               "income_source",
                                                               "income_source_type",
                                                               "postal_city");

    private final Operation RESET_ALL_MEDIATION_CODE_SEQUENCES =
        resetAllMediationCodeSequences();

    private static Operation resetAllMediationCodeSequences() {
        List<Operation> operations = new ArrayList<>(26);
        for (int i = 0; i < 26; i++) {
            char letter = (char) ('a' + i);
            operations.add(Operations.sql("ALTER SEQUENCE mediation_code_" + letter + "_seq RESTART WITH 1"));
        }
        return Operations.sequenceOf(operations);
    }

    @Autowired
    private DataSource dataSource;

    protected void dbSetup(Operation operation) {
        DbSetup setup = new DbSetup(new DataSourceDestination(dataSource),
                                    Operations.sequenceOf(DELETE_ALL, RESET_ALL_MEDIATION_CODE_SEQUENCES, operation));
        TRACKER.launchIfNecessary(setup);
    }
}
