package org.globe42.web

import org.hamcrest.CoreMatchers
import org.springframework.test.web.servlet.MockMvcResultMatchersDsl
import org.springframework.test.web.servlet.ResultActionsDsl
import org.springframework.test.web.servlet.ResultHandler

fun MockMvcResultMatchersDsl.jsonValue(expression: String, value: Any?) {
    value?.let {
        jsonPath(expression) { value(it) }
    } ?: jsonPath(expression, CoreMatchers.nullValue())
}

fun ResultActionsDsl.andGetAsyncResult(): ResultActionsDsl {
    return andDo {
        handle(ResultHandler { it.asyncResult })
    }
}
