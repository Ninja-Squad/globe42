package org.globe42.web.persons

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.eq
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.PersonDao
import org.globe42.domain.Person
import org.globe42.storage.FileDTO
import org.globe42.storage.ReadableFile
import org.globe42.storage.StorageService
import org.globe42.test.GlobeMvcTest
import org.globe42.web.andGetAsyncResult
import org.globe42.web.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.multipart
import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.*

/**
 * MVC tests for [PersonFileController]
 * @author JB Nizet
 */
@GlobeMvcTest(PersonFileController::class)
class PersonFileControllerMvcTest(@Autowired private val mvc: MockMvc) {

    @MockBean
    private lateinit var mockStorageService: StorageService

    @MockBean
    private lateinit var mockPersonDao: PersonDao

    private lateinit var person: Person
    private lateinit var directory: String

    @BeforeEach
    fun prepare() {
        person = Person(1000L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        directory = java.lang.Long.toString(person.id!!)
    }

    @Test
    fun `should create`() {
        val file = FileDTO("new.txt", 3L, Instant.now(), "text/plain")
        val multipartFile = MockMultipartFile(
            "file",
            "new.txt",
            "text/plain",
            "new".toByteArray(StandardCharsets.UTF_8)
        )

        whenever(
            mockStorageService.create(
                eq(directory),
                eq(multipartFile.originalFilename),
                eq(multipartFile.contentType),
                any()
            )
        ).thenReturn(file)

        mvc.multipart("/api/persons/{personId}/files", person.id) {
            file(multipartFile)
        }.andExpect {
            status { isCreated }
            jsonValue("$.name", "new.txt")
        }
    }

    @Test
    fun `should get`() {
        val file = FileDTO("hello.txt", 5L, Instant.now(), "text/plain")
        val readableFile = mock<ReadableFile>()
        whenever(readableFile.file).thenReturn(file)
        whenever(readableFile.inputStream).thenReturn(ByteArrayInputStream("hello".toByteArray(StandardCharsets.UTF_8)))
        whenever(mockStorageService.get(directory, file.name)).thenReturn(readableFile)

        mvc.get("/api/persons/{personId}/files/{name}", person.id, file.name).andGetAsyncResult().andExpect {
            status { isOk }
            header { longValue(HttpHeaders.CONTENT_LENGTH, 5L) }
            content {
                contentType(MediaType.TEXT_PLAIN)
                bytes("hello".toByteArray(StandardCharsets.UTF_8))
            }
        }
    }
}
