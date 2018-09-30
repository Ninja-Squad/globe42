package org.globe42.web.persons

import com.nhaarman.mockitokotlin2.*
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.PersonDao
import org.globe42.domain.Person
import org.globe42.storage.FileDTO
import org.globe42.storage.ReadableFile
import org.globe42.storage.StorageService
import org.globe42.test.Mockito
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.*

/**
 * Unit tests for [PersonFileController]
 * @author JB Nizet
 */
@Mockito
class PersonFileControllerTest {
    @Mock
    private lateinit var mockPersonDao: PersonDao

    @Mock
    private lateinit var mockStorageService: StorageService

    @InjectMocks
    private lateinit var controller: PersonFileController

    private lateinit var person: Person
    private lateinit var directory: String

    @BeforeEach
    fun prepare() {
        person = Person(1000L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        directory = java.lang.Long.toString(person.id!!)
    }

    @Test
    fun `should list`() {
        val file = FileDTO("hello.txt", 5L, Instant.now(), "text/plain")
        whenever(mockStorageService.list(directory)).thenReturn(listOf(file))

        val result = controller.list(person.id!!)

        assertThat(result).containsExactly(file)
    }

    @Test
    @Throws(IOException::class)
    fun `should get`() {
        val file = FileDTO("hello.txt", 5L, Instant.now(), "text/plain")
        val readableFile = mock<ReadableFile>()
        whenever(readableFile.file).thenReturn(file)
        whenever(readableFile.inputStream).thenReturn(ByteArrayInputStream("hello".toByteArray(StandardCharsets.UTF_8)))
        whenever(mockStorageService.get(directory, file.name)).thenReturn(readableFile)

        val result = controller.get(person.id!!, file.name)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(result.headers.contentType).isEqualTo(MediaType.TEXT_PLAIN)
        assertThat(result.headers.contentLength).isEqualTo(file.size)
        val out = ByteArrayOutputStream()
        result.body!!.writeTo(out)
        assertThat(out.toByteArray()).isEqualTo("hello".toByteArray(StandardCharsets.UTF_8))
    }

    @Test
    @Throws(IOException::class)
    fun `should create`() {
        val multipartFile = MockMultipartFile(
            "file",
            "new.txt",
            "text/plain",
            "new".toByteArray(StandardCharsets.UTF_8)
        )
        val file = FileDTO("new.txt", 3L, Instant.now(), "text/plain")

        whenever(
            mockStorageService.create(
                eq(directory),
                eq(multipartFile.originalFilename),
                eq(multipartFile.contentType),
                any()
            )
        ).thenReturn(file)

        val result = controller.create(person.id!!, multipartFile)

        assertThat(result).isEqualTo(file)
    }

    @Test
    @Throws(IOException::class)
    fun `should delete`() {
        controller.delete(person.id!!, "hello.txt")
        verify(mockStorageService).delete(directory, "hello.txt")
    }
}
