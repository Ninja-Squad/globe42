package org.globe42.web.persons;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.storage.FileDTO;
import org.globe42.storage.ReadableFile;
import org.globe42.storage.StorageService;
import org.globe42.test.GlobeMvcTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * MVC tests for {@link PersonFileController}
 * @author JB Nizet
 */
@GlobeMvcTest(PersonFileController.class)
public class PersonFileControllerMvcTest {

    @MockBean
    private StorageService mockStorageService;

    @MockBean
    private PersonDao mockPersonDao;

    @Autowired
    private MockMvc mvc;

    private Person person;
    private String directory;

    @BeforeEach
    public void prepare() {
        person = new Person(1000L);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        directory = Long.toString(person.getId());
    }

    @Test
    public void shouldCreate() throws Exception {
        FileDTO file = new FileDTO("new.txt", 3L, Instant.now(), "text/plain");
        MockMultipartFile multipartFile =
            new MockMultipartFile("file", "new.txt", "text/plain", "new".getBytes(StandardCharsets.UTF_8));

        when(mockStorageService.create(eq(directory),
                                       eq(multipartFile.getOriginalFilename()),
                                       eq(multipartFile.getContentType()),
                                       any(InputStream.class))).thenReturn(file);

        mvc.perform(multipart("/api/persons/{personId}/files", person.getId())
                .file(multipartFile))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.name").value("new.txt"));
    }

    @Test
    public void shouldGet() throws Exception {
        FileDTO file = new FileDTO("hello.txt", 5L, Instant.now(), "text/plain");
        ReadableFile readableFile = mock(ReadableFile.class);
        when(readableFile.getFile()).thenReturn(file);
        when(readableFile.getInputStream()).thenReturn(new ByteArrayInputStream("hello".getBytes(StandardCharsets.UTF_8)));
        when(mockStorageService.get(directory, file.getName())).thenReturn(readableFile);

        mvc.perform(get("/api/persons/{personId}/files/{name}", person.getId(), file.getName()))
           .andDo(MvcResult::getAsyncResult)
           .andExpect(status().isOk())
           .andExpect(content().contentType(MediaType.TEXT_PLAIN))
           .andExpect(content().bytes("hello".getBytes(StandardCharsets.UTF_8)))
           .andExpect(header().longValue(HttpHeaders.CONTENT_LENGTH, 5L));
    }
}
