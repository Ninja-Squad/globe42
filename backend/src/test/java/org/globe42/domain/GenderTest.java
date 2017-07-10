package org.globe42.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Unit tests for {@link Gender}
 * @author JB Nizet
 */
@JsonTest
@RunWith(SpringRunner.class)
public class GenderTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldSerializeAndDeserialize() throws IOException {
        String json = objectMapper.writeValueAsString(Gender.MALE);
        assertThat(json).isEqualTo("\"male\"");

        Gender gender = objectMapper.readValue(json, Gender.class);
        assertThat(gender).isEqualTo(Gender.MALE);
    }
}
