package org.globe42.dao

import org.flywaydb.core.Flyway
import org.springframework.boot.autoconfigure.data.jpa.EntityManagerFactoryDependsOnPostProcessor
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.persistence.EntityManagerFactory
import javax.sql.DataSource

/**
 * Configuration class used to provide a Flyway bean instead of the standard bean provided by Spring Boot.
 * This causes the Spring Boot configuration properties of Flyways to be ignored.
 * It's necessary because the Flyway version Spring Boot uses doesn't support the old PostgreSQL version
 * that Clever Cloud forces us to use. Once Clever Cloud finally upgrades, we should be able to delete this
 * class.
 * @author JB Nizet
 */
@Configuration
class FlywayConfig {
    @Bean
    fun flyway(dataSource: DataSource): Flyway {
        val flyway = Flyway()
        flyway.dataSource = dataSource
        return flyway
    }

    @Bean
    fun flywayInitializer(flyway: Flyway): FlywayMigrationInitializer {
        return FlywayMigrationInitializer(flyway, null)
    }

    /**
     * Additional configuration to ensure that [EntityManagerFactory] beans depend on the
     * `flywayInitializer` bean.
     */
    @Configuration
    class FlywayInitializerJpaDependencyConfiguration : EntityManagerFactoryDependsOnPostProcessor("flywayInitializer")
}
