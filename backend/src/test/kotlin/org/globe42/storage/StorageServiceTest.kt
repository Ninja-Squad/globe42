package org.globe42.storage

import com.google.api.gax.paging.Page
import com.google.cloud.ReadChannel
import com.google.cloud.WriteChannel
import com.google.cloud.storage.Blob
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import com.google.common.io.ByteStreams
import io.mockk.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.nio.ByteBuffer
import java.nio.charset.StandardCharsets
import java.time.Instant

/**
 * Unit tests for [StorageService]
 * @author JB Nizet
 */
class StorageServiceTest {
    private lateinit var mockStorage: Storage

    private lateinit var storageProperties: StorageProperties

    private lateinit var service: StorageService

    private lateinit var blob: Blob

    @BeforeEach
    fun prepare() {
        mockStorage = mockk(relaxed = true)
        blob = mockk {
            every { name } returns "foo/hello.txt"
            every { size } returns 5
            every { contentType } returns "text/plain"
            every { createTime } returns System.currentTimeMillis() - 100000L
        }

        storageProperties = StorageProperties(bucket = "personfiles")

        service = StorageService(mockStorage, storageProperties)
    }

    @Suppress("UNCHECKED_CAST")
    @Test
    fun `should list`() {
        val mockPage = mockk<Page<Blob>>()
        every { mockPage.values } returns listOf(blob)

        every {
            mockStorage.list(
                storageProperties.bucket,
                Storage.BlobListOption.pageSize(10000),
                Storage.BlobListOption.currentDirectory(),
                Storage.BlobListOption.prefix("foo/")
            )
        }  returns mockPage

        val result = service.list("foo")

        assertThat(result).hasSize(1)
        val (name, size, creationInstant, contentType) = result[0]
        assertThat(contentType).isEqualTo(blob.contentType)
        assertThat(size).isEqualTo(blob.size)
        assertThat(creationInstant).isEqualTo(Instant.ofEpochMilli(blob.createTime))
        assertThat(name).isEqualTo("hello.txt")
    }

    @Test
    fun `should get`() {
        val blobName = blob.name
        every { mockStorage.get(storageProperties.bucket, blobName) } returns blob

        val mockChannel = mockk<ReadChannel>()
        every { blob.reader() } returns mockChannel

        every { mockChannel.read(any()) } answers FakeReadAnswer()

        val result = service.get("foo", "hello.txt")

        val file = result.file
        assertThat(file.contentType).isEqualTo(blob.contentType)
        assertThat(file.size).isEqualTo(blob.size)
        assertThat(file.creationInstant).isEqualTo(Instant.ofEpochMilli(blob.createTime))
        assertThat(file.name).isEqualTo("hello.txt")
        val bytes = ByteStreams.toByteArray(result.inputStream)
        assertThat(bytes).isEqualTo("hello".toByteArray(StandardCharsets.UTF_8))
    }

    @Test
    fun `should create`() {
        val blobInfo = BlobInfo.newBuilder(storageProperties.bucket, "foo/new.txt")
            .setContentType("text/plain")
            .build()

        val written = ByteArray(7)
        val mockWriteChannel = mockk<WriteChannel>(relaxUnitFun = true)
        every { mockWriteChannel.write(any()) } answers {
            val byteBuffer = arg<ByteBuffer>(0)
            byteBuffer.get(written, 0, byteBuffer.limit())
            written.size
        }
        every { mockStorage.writer(blobInfo) } returns mockWriteChannel

        val result = service.create(
            "foo",
            "new.txt",
            "text/plain",
            "goodbye".toByteArray(StandardCharsets.UTF_8).inputStream()
        )

        assertThat(result.name).isEqualTo("new.txt")
        assertThat(result.creationInstant).isNotNull()
        assertThat(result.contentType).isEqualTo("text/plain")
        assertThat(written).isEqualTo("goodbye".toByteArray(StandardCharsets.UTF_8))
    }

    @Test
    fun `should delete`() {
        service.delete("foo", "hello.txt")

        verify { mockStorage.delete(storageProperties.bucket, "foo/hello.txt") }
    }

    private class FakeReadAnswer : Answer<Int> {
        private var count = 0

        override fun answer(call: Call): Int {
            if (count == 0) {
                val buffer = call.invocation.args[0] as ByteBuffer
                buffer.put("hello".toByteArray(StandardCharsets.UTF_8))
                count++
                return "hello".length
            } else {
                return -1 // end of stream
            }
        }
    }
}
