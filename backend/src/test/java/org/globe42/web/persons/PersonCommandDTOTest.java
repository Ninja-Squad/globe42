package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.globe42.test.JsonTestUtil.OBJECT_MAPPER;

import java.io.IOException;

import org.globe42.domain.Gender;
import org.junit.Test;

/**
 * Unit tests for {@link PersonCommandDTO}
 * @author JB Nizet
 */
public class PersonCommandDTOTest {
    @Test
    public void shouldDeserialize() throws IOException {
        String json = "{\n" +
            "    \"surName\": \"Agnes\",\n" +
            "    \"gender\": \"female\",\n" +
            "    \"isAdherent\": true,\n" +
            "    \"city\": {\n" +
            "        \"code\": \"42000\",\n" +
            "        \"city\": \"SAINT-ETIENNE\"\n" +
            "    }\n" +
            "}";

        PersonCommandDTO command = OBJECT_MAPPER.readValue(json, PersonCommandDTO.class);
        assertThat(command.getSurName()).isEqualTo("Agnes");
        assertThat(command.getGender()).isEqualTo(Gender.FEMALE);
        assertThat(command.isAdherent()).isTrue();
        assertThat(command.getCity().getCode()).isEqualTo("42000");
        assertThat(command.getCity().getCity()).isEqualTo("SAINT-ETIENNE");
    }
}
