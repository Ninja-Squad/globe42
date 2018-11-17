plugins {
    base
    id("com.moowork.node") version "1.2.0"
}

node {
    version = "8.11.3"
    npmVersion = "6.1.0"
    yarnVersion = "1.10.1"
    download = true
}

tasks {
    getByName("npmInstall") {
        enabled = false
    }

    val yarn_install by getting {
        inputs.file("package.json")
        inputs.file("yarn.lock")
        outputs.dir("node_modules")
    }

    val deleteMomentLocales by creating(Delete::class) {
        dependsOn(yarn_install)
        delete(fileTree("${projectDir}/node_modules/moment/locale") {
            include("*.js")
        })
    }

    val prepare by creating {
        dependsOn(deleteMomentLocales)
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
    }

    getByName("check") {
        dependsOn(lint)
        dependsOn(test)
    }

    getByName("assemble") {
        dependsOn(yarn_build)
    }

    getByName("clean") {
        dependsOn("cleanYarn_build")
        dependsOn("cleanYarn_test")
        dependsOn("cleanYarn_lint")
    }
}
