plugins {
    base
    id("com.moowork.node") version "1.2.0"
}

node {
    version = "8.11.1"
    npmVersion = "6.0.0"
    yarnVersion = "1.6.0"
    download = true
}

tasks {
    val npmInstall by getting {
        enabled = false
    }

    val npm_run_build by getting {
        dependsOn("yarn_install")
        inputs.dir("src")
        outputs.dir("dist")
    }

    val npm_run_test by getting {
        inputs.dir("src")
        outputs.dir("coverage")
    }

    val yarn_install by getting {
        inputs.file("package.json")
        inputs.file("yarn.lock")
        outputs.dir("node_modules")
    }

    val test by creating {
        dependsOn("npm_run_test")
    }

    val check by getting {
        dependsOn("test")
    }

    val clean by getting {
        dependsOn("cleanNpm_run_build")
        dependsOn("cleanNpm_run_test")
    }
}
