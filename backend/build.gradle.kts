import org.flywaydb.gradle.task.FlywayCleanTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.buildinfo.BuildInfo
import org.springframework.boot.gradle.tasks.bundling.BootJar
import org.springframework.boot.gradle.tasks.run.BootRun

buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath("org.postgresql:postgresql:42.2.5")
    }
}

plugins {
    val kotlinVersion = "1.3.10"

    java
    jacoco
    kotlin("jvm") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.jpa") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.noarg") version kotlinVersion
    id("org.springframework.boot") version "2.1.1.RELEASE"
    id("io.spring.dependency-management") version "1.0.6.RELEASE"
    id("org.flywaydb.flyway") version "5.2.0"
    id("com.gorylenko.gradle-git-properties") version "1.5.2"
    id("org.jetbrains.dokka") version "0.9.17"
}

java {
    sourceCompatibility = JavaVersion.VERSION_1_8
}

repositories {
    mavenCentral()
}

tasks {
    withType(KotlinCompile::class.java) {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict", "-Xjvm-default=enable")
            jvmTarget = "1.8"
        }
    }

    // this task is always out-of-date because it generates a properties file with the build time inside
    // so the bootJar task is also always out of date, too, since it depends on it
    // but it's better to do that than using the bootInfo() method of the springBoot closure, because that
    // makes the test task out of date, which makes the build much longer.
    // See https://github.com/spring-projects/spring-boot/issues/13152
    val buildInfo by creating(BuildInfo::class) {
        destinationDir = file("$buildDir/buildInfo")
    }

    getByName<BootJar>("bootJar") {
        archiveName = "globe42.jar"
        dependsOn(":frontend:assemble")
        dependsOn(buildInfo)

        bootInf {
            into("classes/static") {
                from("${project(":frontend").projectDir}/dist")
            }
            into("classes/META-INF") {
                from(buildInfo.destinationDir)
            }
        }
    }

    getByName<BootRun>("bootRun") {
        args("--globe42.secretKey=QMwbcwa19VV02Oy5T7LSWyV+/wZrOsRRfhCR6TkapsY=")
        args("--globe42.googleCloudStorageCredentialsPath=${rootProject.file("secrets/google-cloud-storage-dev.json")}")
    }

    getByName<Test>("test") {
        useJUnitPlatform()
    }

    getByName<JacocoReport>("jacocoTestReport") {
        reports {
            xml.setEnabled(true)
            html.setEnabled(true)
        }
    }

    // remove default tasks added by flyway plugin
    removeIf { it.name.startsWith("flyway") }

    val flywayCleanInteg by creating(FlywayCleanTask::class) {
        url = "jdbc:postgresql://localhost:5432/globe42"
    }
    val flywayCleanTest by creating(FlywayCleanTask::class) {
        url = "jdbc:postgresql://localhost:5432/globe42_test"
    }

    listOf(flywayCleanInteg, flywayCleanTest).forEach {
        it.apply {
            user = "globe42"
            password = "globe42"
            (this as DefaultTask).group = "Database"
            table = "schema_version"
        }
    }
}

extra["flyway.version"] = "4.2.0" // old version needed because Clever cloud only supports postgresql 9.2, and Flyway 5 doesn't support 9.2 anymore

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.jsonwebtoken:jjwt:0.9.1")
    implementation("com.google.cloud:google-cloud-storage:1.49.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.flywaydb:flyway-core:${extra["flyway.version"]}")

    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("org.flywaydb:flyway-core")

    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(module = "junit")
    }
    testImplementation("com.ninja-squad:DbSetup:2.1.0")
    testImplementation("com.ninja-squad:DbSetup-kotlin:2.1.0")
    testImplementation("org.junit.jupiter:junit-jupiter-api")
    testImplementation("com.nhaarman.mockitokotlin2:mockito-kotlin:2.0.0")
    testImplementation("org.mockito:mockito-junit-jupiter:2.23.0")

    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine")
}
