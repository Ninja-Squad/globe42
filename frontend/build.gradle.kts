import com.github.gradle.node.yarn.task.YarnInstallTask
import com.github.gradle.node.yarn.task.YarnTask

plugins {
    base
    id("com.github.node-gradle.node") version "3.1.1"
}

node {
    version.set("14.17.0")
    npmVersion.set("6.14.10")
    yarnVersion.set("1.22.10")
    download.set(true)
}

tasks {
    npmInstall {
        enabled = false
    }

    named<YarnInstallTask>(YarnInstallTask.NAME) {
        ignoreExitValue.set(true)
    }

    val prepare by registering {
        dependsOn(YarnInstallTask.NAME)
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
        inputs.file(".eslintrc.json")
        inputs.file(".prettierrc")
        outputs.file("$buildDir/eslint-result.txt")
    }

    val lint by registering {
        dependsOn(yarnLint)
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
