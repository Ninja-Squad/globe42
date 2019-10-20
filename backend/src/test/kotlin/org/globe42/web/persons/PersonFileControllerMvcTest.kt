package org.globe42.web.persons

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.mockk
import org.globe42.dao.PersonDao
import org.globe42.domain.Person
import org.globe42.storage.FileDTO
import org.globe42.storage.ReadableFile
import org.globe42.storage.StorageService
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.asyncDispatch
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.multipart
import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets
import java.time.Instant

/**
 * MVC tests for [PersonFileController]
 * @author JB Nizet
 */
@GlobeMvcTest(PersonFileController::class)
class PersonFileControllerMvcTest(@Autowired private val mvc: MockMvc) {

    @MockkBean
    private lateinit var mockStorageService: StorageService

    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    private lateinit var person: Person
    private lateinit var directory: String

    @BeforeEach
    fun prepare() {
        person = Person(1000L)
        every { mockPersonDao.findByIdOrNull(person.id!!)} returns person
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

        every {
            mockStorageService.create(
                eq(directory),
                eq(multipartFile.originalFilename),
                eq(multipartFile.contentType!!),
                any()
            )
        } returns file

        mvc.multipart("/api/persons/{personId}/files", person.id) {
            file(multipartFile)
        }.andExpect {
            status { isCreated }
            jsonValue("$.name", "new.txt")
        }
    }

    @Test
    fun `should get`() {
        val theFile = FileDTO("hello.txt", 5L, Instant.now(), "text/plain")
        val readableFile = mockk<ReadableFile> {
            every { file } returns theFile
            every { inputStream } returns ByteArrayInputStream("hello".toByteArray(StandardCharsets.UTF_8))
        }
        every { mockStorageService.get(directory, theFile.name)} returns readableFile

        mvc.get("/api/persons/{personId}/files/{name}", person.id, theFile.name).asyncDispatch(mvc).andExpect {
            status { isOk }
            header { longValue(HttpHeaders.CONTENT_LENGTH, 5L) }
            content {
                contentType(MediaType.TEXT_PLAIN)
                bytes("hello".toByteArray(StandardCharsets.UTF_8))
            }
        }
    }
}
