plugins {
    base
    id("com.moowork.node") version "1.2.0"
}

node {
    version = "12.3.1"
    npmVersion = "6.9.0"
    yarnVersion = "1.16.0"
    download = true
}

tasks {
    npmInstall {
        enabled = false
    }

    val yarn_install by getting {
        inputs.file("package.json")
        inputs.file("yarn.lock")
        outputs.dir("node_modules")
    }

    val prepare by creating {
        dependsOn(yarn_install)
    }

    val yarn_build by getting {
        dependsOn(prepare)
        inputs.dir("src")
        outputs.dir("dist")
    }

    val yarn_test by getting {
        dependsOn(prepare)
        inputs.dir("src")
        outputs.dir("coverage")
    }

    val test by creating {
        dependsOn(yarn_test)
    }

    val yarn_lint by getting {
        dependsOn(prepare)
        inputs.dir("src")
        inputs.file("tslint.json")
        outputs.file("tslint-result.txt")
    }

    val lint by creating {
        dependsOn("yarn_lint")
        doLast {
            file("tslint-result.txt").useLines { sequence ->
                if (sequence.any { it.contains("WARNING") }) {
                    throw GradleException("Lint warning found. Check tslint-result.txt")
                }
            }
        }
    }

    check {
        dependsOn(lint)
        dependsOn(test)
    }

    assemble {
        dependsOn(yarn_build)
    }

    clean {
        dependsOn("cleanYarn_build")
        dependsOn("cleanYarn_test")
        dependsOn("cleanYarn_lint")
    }
}
