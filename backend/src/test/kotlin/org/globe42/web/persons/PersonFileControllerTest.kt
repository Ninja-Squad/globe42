package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.Person
import org.globe42.storage.FileDTO
import org.globe42.storage.ReadableFile
import org.globe42.storage.StorageService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.*

/**
 * Unit tests for [PersonFileController]
 * @author JB Nizet
 */
class PersonFileControllerTest {
    private val mockPersonDao = mockk<PersonDao>()

    private val mockStorageService = mockk<StorageService>(relaxUnitFun = true)

    private val controller = PersonFileController(mockPersonDao, mockStorageService)

    private lateinit var person: Person
    private lateinit var directory: String

    @BeforeEach
    fun prepare() {
        person = Person(1000L)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        directory = person.id.toString()
    }

    @Test
    fun `should list`() {
        val file = FileDTO("hello.txt", 5L, Instant.now(), "text/plain")
        every { mockStorageService.list(directory) } returns listOf(file)

        val result = controller.list(person.id!!)

        assertThat(result).containsExactly(file)
    }

    @Test
    fun `should get`() {
        val theFile = FileDTO("hello.txt", 5L, Instant.now(), "text/plain")
        val readableFile = mockk<ReadableFile> {
            every { file } returns theFile
            every { inputStream } returns ByteArrayInputStream("hello".toByteArray(StandardCharsets.UTF_8))
        }
        every { mockStorageService.get(directory, theFile.name) } returns readableFile

        val result = controller.get(person.id!!, theFile.name)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(result.headers.contentType).isEqualTo(MediaType.TEXT_PLAIN)
        assertThat(result.headers.contentLength).isEqualTo(theFile.size)
        val out = ByteArrayOutputStream()
        result.body!!.writeTo(out)
        assertThat(out.toByteArray()).isEqualTo("hello".toByteArray(StandardCharsets.UTF_8))
    }

    @Test
    fun `should create`() {
        val multipartFile = MockMultipartFile(
            "file",
            "new.txt",
            "text/plain",
            "new".toByteArray(StandardCharsets.UTF_8)
        )
        val file = FileDTO("new.txt", 3L, Instant.now(), "text/plain")

        every {
            mockStorageService.create(
                eq(directory),
                eq(multipartFile.originalFilename),
                eq(multipartFile.contentType!!),
                any()
            )
        } returns file

        val result = controller.create(person.id!!, multipartFile)

        assertThat(result).isEqualTo(file)
    }

    @Test
    fun `should delete`() {
        controller.delete(person.id!!, "hello.txt")
        verify { mockStorageService.delete(directory, "hello.txt") }
    }
}
