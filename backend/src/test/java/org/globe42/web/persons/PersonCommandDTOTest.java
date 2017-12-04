package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.globe42.domain.Gender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * Unit tests for {@link PersonCommandDTO}
 * @author JB Nizet
 */
@JsonTest
@ExtendWith(SpringExtension.class)
public class PersonCommandDTOTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldDeserialize() throws IOException {
        String json = "{\n" +
            "    \"nickName\": \"Agnes\",\n" +
            "    \"gender\": \"FEMALE\",\n" +
            "    \"adherent\": true,\n" +
            "    \"city\": {\n" +
            "        \"code\": \"42000\",\n" +
            "        \"city\": \"SAINT-ETIENNE\"\n" +
            "    }\n" +
            "}";

        PersonCommandDTO command = objectMapper.readValue(json, PersonCommandDTO.class);
        assertThat(command.getNickName()).isEqualTo("Agnes");
        assertThat(command.getGender()).isEqualTo(Gender.FEMALE);
        assertThat(command.isAdherent()).isTrue();
        assertThat(command.getCity().getCode()).isEqualTo("42000");
        assertThat(command.getCity().getCity()).isEqualTo("SAINT-ETIENNE");
    }
}
