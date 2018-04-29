package org.globe42.web.persons

import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.Gender
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.json.JsonTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.io.IOException

/**
 * Unit tests for [PersonCommandDTO]
 * @author JB Nizet
 */
@JsonTest
@ExtendWith(SpringExtension::class)
class PersonCommandDTOTest {

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    @Throws(IOException::class)
    fun `should deserialize`() {
        val json = """{
            "firstName": "Agnes",
            "lastName": "Crepet",
            "nickName": "Agnes",
            "gender": "FEMALE",
            "city": {
              "code": "42000",
              "city": "SAINT-ETIENNE"
            }
        }"""

        val command = objectMapper.readValue(json, PersonCommandDTO::class.java)
        assertThat(command.nickName).isEqualTo("Agnes")
        assertThat(command.gender).isEqualTo(Gender.FEMALE)
        assertThat(command.city!!.code).isEqualTo("42000")
        assertThat(command.city!!.city).isEqualTo("SAINT-ETIENNE")
    }
}
