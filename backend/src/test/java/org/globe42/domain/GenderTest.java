package org.globe42.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.globe42.test.JsonTestUtil.OBJECT_MAPPER;

import java.io.IOException;

import org.junit.Test;

/**
 * Unit tests for {@link Gender}
 * @author JB Nizet
 */
public class GenderTest {
    @Test
    public void shouldSerializeAndDeserialize() throws IOException {
        String json = OBJECT_MAPPER.writeValueAsString(Gender.MALE);
        assertThat(json).isEqualTo("\"male\"");

        Gender gender = OBJECT_MAPPER.readValue(json, Gender.class);
        assertThat(gender).isEqualTo(Gender.MALE);
    }
}
