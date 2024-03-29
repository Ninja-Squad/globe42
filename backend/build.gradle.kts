
import org.flywaydb.gradle.task.FlywayCleanTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.buildinfo.BuildInfo

buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath("org.postgresql:postgresql:42.3.5")
    }
}

plugins {
    val kotlinVersion = "1.6.21"

    java
    jacoco
    kotlin("jvm") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.jpa") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.noarg") version kotlinVersion
    id("org.springframework.boot") version "2.7.0"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("org.flywaydb.flyway") version "8.5.11"
    id("com.gorylenko.gradle-git-properties") version "2.4.1"
}

repositories {
    mavenCentral()
}

// otherwise lazy ToOne assiciations are not lazy
allOpen {
    annotation("javax.persistence.Entity")
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
            xml.required.set(true)
            html.required.set(true)
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

val jwtVersion = "0.11.5"
val poiVersion = "5.2.2"
val dbSetupVersion = "2.1.0"
val itextVersion = "7.2.2"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.jsonwebtoken:jjwt-api:$jwtVersion")
    implementation("com.google.cloud:google-cloud-storage:2.6.1")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.apache.poi:poi:$poiVersion")
    implementation("org.apache.poi:poi-ooxml:$poiVersion")
    implementation("com.itextpdf:kernel:$itextVersion")
    implementation("com.itextpdf:io:$itextVersion")
    implementation("com.itextpdf:layout:$itextVersion")

    runtimeOnly("io.jsonwebtoken:jjwt-impl:$jwtVersion")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:$jwtVersion")
    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("org.flywaydb:flyway-core")

    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(module = "mockito")
    }
    testImplementation("com.ninja-squad:springmockk:3.1.1")
    testImplementation("io.mockk:mockk:1.12.4")

    testImplementation("com.ninja-squad:DbSetup:$dbSetupVersion")
    testImplementation("com.ninja-squad:DbSetup-kotlin:$dbSetupVersion")
    testImplementation("org.junit.jupiter:junit-jupiter")
    testImplementation("com.squareup.okhttp3:mockwebserver")
}
