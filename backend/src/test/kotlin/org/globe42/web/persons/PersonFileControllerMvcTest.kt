package org.globe42.web.persons

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.eq
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.Person
import org.globe42.storage.FileDTO
import org.globe42.storage.ReadableFile
import org.globe42.storage.StorageService
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.*

/**
 * MVC tests for [PersonFileController]
 * @author JB Nizet
 */
@GlobeMvcTest(PersonFileController::class)
class PersonFileControllerMvcTest {

    @MockBean
    private lateinit var mockStorageService: StorageService

    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @Autowired
    private lateinit var mvc: MockMvc

    private lateinit var person: Person
    private lateinit var directory: String

    @BeforeEach
    fun prepare() {
        person = Person(1000L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        directory = java.lang.Long.toString(person.id!!)
    }

    @Test
    @Throws(Exception::class)
    fun shouldCreate() {
        val file = FileDTO("new.txt", 3L, Instant.now(), "text/plain")
        val multipartFile = MockMultipartFile("file",
                                              "new.txt",
                                              "text/plain",
                                              "new".toByteArray(StandardCharsets.UTF_8))

        whenever(mockStorageService.create(eq(directory),
                                           eq(multipartFile.originalFilename),
                                           eq(multipartFile.contentType),
                                           any())).thenReturn(file)

        mvc.perform(multipart("/api/persons/{personId}/files", person.id)
                              .file(multipartFile))
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.name").value("new.txt"))
    }

    @Test
    @Throws(Exception::class)
    fun shouldGet() {
        val file = FileDTO("hello.txt", 5L, Instant.now(), "text/plain")
        val readableFile = mock<ReadableFile>()
        whenever(readableFile.file).thenReturn(file)
        whenever(readableFile.inputStream).thenReturn(ByteArrayInputStream("hello".toByteArray(StandardCharsets.UTF_8)))
        whenever(mockStorageService.get(directory, file.name)).thenReturn(readableFile)

        mvc.perform(get("/api/persons/{personId}/files/{name}", person.id, file.name))
                .andDo { it.getAsyncResult() }
                .andExpect(status().isOk)
                .andExpect(content().contentType(MediaType.TEXT_PLAIN))
                .andExpect(content().bytes("hello".toByteArray(StandardCharsets.UTF_8)))
                .andExpect(header().longValue(HttpHeaders.CONTENT_LENGTH, 5L))
    }
}
