package org.globe42.web.test

import org.hamcrest.CoreMatchers
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MockMvcResultMatchersDsl
import org.springframework.test.web.servlet.ResultActionsDsl
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders

fun MockMvcResultMatchersDsl.jsonValue(expression: String, value: Any?) {
    value?.let {
        jsonPath(expression) { value(it) }
    } ?: jsonPath(expression, CoreMatchers.nullValue())
}
