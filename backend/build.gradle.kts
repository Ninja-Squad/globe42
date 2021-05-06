
import org.flywaydb.gradle.task.FlywayCleanTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.buildinfo.BuildInfo

buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath("org.postgresql:postgresql:42.2.19")
    }
}

plugins {
    val kotlinVersion = "1.5.0"

    java
    jacoco
    kotlin("jvm") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.jpa") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.noarg") version kotlinVersion
    id("org.springframework.boot") version "2.4.5"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("org.flywaydb.flyway") version "7.1.1"
    id("com.gorylenko.gradle-git-properties") version "2.2.4"
}

repositories {
    mavenCentral()
}

// otherwise lazy ToOne assiciations are not lazy
allOpen {
    annotation("javax.persistence.Entity")
}

jacoco {
    toolVersion = "0.8.7"
}

tasks {
    withType<KotlinCompile>() {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict", "-Xjvm-default=all")
            jvmTarget = "11"
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

    bootJar {
        archiveFileName.set("globe42.jar")
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

    bootRun {
        args("--globe42.secretKey=QMwbcwa19VV02Oy5T7LSWyV+/wZrOsRRfhCR6TkapsY=")
        args("--globe42.google-cloud-storage.credentials-path=${rootProject.file("secrets/google-cloud-storage-dev.json")}")
    }

    test {
        maxHeapSize = "1024m"
        useJUnitPlatform()
    }

    jacocoTestReport {
        reports {
            xml.setEnabled(true)
            html.setEnabled(true)
        }
    }

    // disable default tasks added by flyway plugin
    matching { it.name.startsWith("flyway") }.forEach { it.enabled = false }

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

ext["okhttp3.version"] = "4.8.0"
val jwtVersion = "0.11.2"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.jsonwebtoken:jjwt-api:$jwtVersion")
    implementation("com.google.cloud:google-cloud-storage:1.113.9")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.apache.poi:poi:4.1.2")
    implementation("org.apache.poi:poi-ooxml:4.1.2")

    runtimeOnly("io.jsonwebtoken:jjwt-impl:$jwtVersion")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:$jwtVersion")
    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("org.flywaydb:flyway-core")

    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(module = "mockito")
    }
    testImplementation("com.ninja-squad:springmockk:3.0.1")
    testImplementation("io.mockk:mockk:1.10.4")

    testImplementation("com.ninja-squad:DbSetup:2.1.0")
    testImplementation("com.ninja-squad:DbSetup-kotlin:2.1.0")
    testImplementation("org.junit.jupiter:junit-jupiter")
    testImplementation("com.squareup.okhttp3:mockwebserver")
}
