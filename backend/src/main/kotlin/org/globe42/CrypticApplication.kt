package org.globe42

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CrypticApplication {

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            runApplication<CrypticApplication>(*args)
        }
    }
}
