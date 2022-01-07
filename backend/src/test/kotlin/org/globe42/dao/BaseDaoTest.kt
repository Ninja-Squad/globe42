package org.globe42.dao

import com.ninja_squad.dbsetup.DbSetupTracker
import com.ninja_squad.dbsetup_kotlin.DbSetupBuilder
import com.ninja_squad.dbsetup_kotlin.dbSetup
import com.ninja_squad.dbsetup_kotlin.launchWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.TestPropertySource
import javax.sql.DataSource

/**
 * Base class for DAO tests
 * @author JB Nizet
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource("/test.properties")
@Rollback(false)
abstract class BaseDaoTest {

    @Autowired
    private lateinit var dataSource: DataSource

    protected fun setup(configure: DbSetupBuilder.() -> Unit) {
        dbSetup(to = dataSource) {
            deleteAllFrom(
                "person_note",
                "note",
                "spent_time",
                "task",
                "guser",
                "income",
                "participation",
                "membership",
                "person",
                "relative",
                "family",
                "income_source",
                "income_source_type",
                "postal_city",
                "country"
            )

            sequenceOf(('a'..'z').map { letter ->
                sql("ALTER SEQUENCE mediation_code_${letter}_seq RESTART WITH 1")
            })

            configure()
        }.launchWith(TRACKER)
    }

    protected fun skipNextLaunch() {
        TRACKER.skipNextLaunch()
    }

    companion object {
        private val TRACKER = DbSetupTracker()
    }
}
