package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.storage.FileDTO;
import org.globe42.storage.ReadableFile;
import org.globe42.storage.StorageService;
import org.globe42.test.BaseTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * Unit tests for {@link PersonFileController}
 * @author JB Nizet
 */
public class PersonFileControllerTest extends BaseTest {
    @Mock
    private PersonDao mockPersonDao;

    @Mock
    private StorageService mockStorageService;

    @InjectMocks
    private PersonFileController controller;

    private Person person;
    private String directory;

    @BeforeEach
    public void prepare() {
        person = new Person(1000L);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        directory = Long.toString(person.getId());
    }

    @Test
    public void shouldList() {
        FileDTO file = new FileDTO("hello.txt", 5L, Instant.now(), "text/plain");
        when(mockStorageService.list(directory)).thenReturn(Collections.singletonList(file));

        List<FileDTO> result = controller.list(person.getId());

        assertThat(result).containsExactly(file);
    }

    @Test
    public void shouldGet() throws IOException {
        FileDTO file = new FileDTO("hello.txt", 5L, Instant.now(), "text/plain");
        ReadableFile readableFile = mock(ReadableFile.class);
        when(readableFile.getFile()).thenReturn(file);
        when(readableFile.getInputStream()).thenReturn(new ByteArrayInputStream("hello".getBytes(StandardCharsets.UTF_8)));
        when(mockStorageService.get(directory, file.getName())).thenReturn(readableFile);

        ResponseEntity<StreamingResponseBody> result = controller.get(person.getId(), file.getName());

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getHeaders().getContentType()).isEqualTo(MediaType.TEXT_PLAIN);
        assertThat(result.getHeaders().getContentLength()).isEqualTo(file.getSize());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        result.getBody().writeTo(out);
        assertThat(out.toByteArray()).isEqualTo("hello".getBytes(StandardCharsets.UTF_8));
    }

    @Test
    public void shouldCreate() throws IOException {
        MultipartFile multipartFile =
            new MockMultipartFile("file", "new.txt", "text/plain", "new".getBytes(StandardCharsets.UTF_8));
        FileDTO file = new FileDTO("new.txt", 3L, Instant.now(), "text/plain");

        when(mockStorageService.create(eq(directory),
                                       eq(multipartFile.getOriginalFilename()),
                                       eq(multipartFile.getContentType()),
                                       any(InputStream.class))).thenReturn(file);

        FileDTO result = controller.create(person.getId(), multipartFile);

        assertThat(result).isEqualTo(file);
    }

    @Test
    public void shouldDelete() throws IOException {
        controller.delete(person.getId(), "hello.txt");
        verify(mockStorageService).delete(directory, "hello.txt");
    }
}
