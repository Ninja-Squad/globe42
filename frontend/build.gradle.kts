import com.github.gradle.node.yarn.task.YarnInstallTask
import com.github.gradle.node.yarn.task.YarnTask

plugins {
    base
    id("com.github.node-gradle.node") version "3.0.1"
}

node {
    version.set("12.20.1")
    npmVersion.set("6.14.10")
    yarnVersion.set("1.22.10")
    download.set(true)
}

tasks {
    npmInstall {
        enabled = false
    }

    val prepare by registering {
        dependsOn(YarnInstallTask.NAME)
    }

    val yarnNgcc by registering(YarnTask::class) {
        args.set(listOf("ngcc"))
        dependsOn(prepare)
    }

    val yarnBuild by registering(YarnTask::class) {
        args.set(listOf("build"))
        dependsOn(prepare)
        inputs.dir("src")
        outputs.dir("dist")
    }

    val yarnTest by registering(YarnTask::class) {
        args.set(listOf("test"))
        dependsOn(prepare)
        inputs.dir("src")
        outputs.dir("coverage")
    }

    val test by registering {
        dependsOn(yarnTest)
    }

    val yarnLint by registering(YarnTask::class) {
        args.set(listOf("lint"))
        dependsOn(prepare)
        inputs.dir("src")
        inputs.file("tslint.json")
        outputs.file("$buildDir/tslint-result.txt")
    }

    val lint by registering {
        dependsOn(yarnLint)
        doLast {
            file("$buildDir/tslint-result.txt").useLines { sequence ->
                if (sequence.any { it.contains("WARNING") }) {
                    throw GradleException("Lint warning found. Check tslint-result.txt")
                }
            }
        }
    }

    val checkFormat by registering(YarnTask::class) {
        args.set(listOf("format:check"))
        ignoreExitValue.set(true)
        dependsOn(prepare)
        inputs.dir("src")
        inputs.file(".prettierrc")
        outputs.file("prettier-result.txt")
        doLast {
            file("$buildDir/prettier-result.txt").useLines { sequence ->
                if (sequence.any { it.contains("src") }) {
                    throw GradleException ("Formatting warning found. Check prettier-result.txt")
                }
            }
        }
    }

    val yarnCodecov by registering(YarnTask::class) {
        args.set(listOf("codecov"))
        dependsOn(prepare)
    }

    val yarnBundlesize by registering(YarnTask::class) {
        args.set(listOf("bundlesize"))
        dependsOn(prepare)
    }

    check {
        dependsOn(checkFormat)
        dependsOn(lint)
        dependsOn(test)
    }

    assemble {
        dependsOn(yarnBuild)
    }

    clean {
        dependsOn("cleanYarnBuild")
        dependsOn("cleanYarnTest")
    }
}
