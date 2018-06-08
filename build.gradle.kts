allprojects {
    apply(plugin = "project-report")
    version = "1.0-SNAPSHOT"
}

tasks {
    "wrapper"(Wrapper::class) {
        gradleVersion = "4.8"
    }
}
