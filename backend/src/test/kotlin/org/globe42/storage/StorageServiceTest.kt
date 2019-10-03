package org.globe42.storage

import com.google.api.gax.paging.Page
import com.google.cloud.ReadChannel
import com.google.cloud.WriteChannel
import com.google.cloud.storage.Blob
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import com.google.common.io.ByteStreams
import com.nhaarman.mockitokotlin2.*
import org.assertj.core.api.Assertions.assertThat
import org.globe42.test.Mockito
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.invocation.InvocationOnMock
import org.mockito.stubbing.Answer
import java.nio.ByteBuffer
import java.nio.charset.StandardCharsets
import java.time.Instant

/**
 * Unit tests for [StorageService]
 * @author JB Nizet
 */
@Mockito
class StorageServiceTest {
    @Mock
    private lateinit var mockStorage: Storage

    private lateinit var storageProperties: StorageProperties

    private lateinit var service: StorageService

    private lateinit var blob: Blob

    @BeforeEach
    fun prepare() {
        blob = mock<Blob>()
        doReturn("foo/hello.txt").whenever(blob).name
        doReturn(5L).whenever(blob).size
        doReturn("text/plain").whenever(blob).contentType
        val createTime = System.currentTimeMillis() - 100000L
        doReturn(createTime).whenever(blob).createTime

        storageProperties = StorageProperties(bucket = "personfiles")

        service = StorageService(mockStorage, storageProperties)
    }

    @Suppress("UNCHECKED_CAST")
    @Test
    fun `should list`() {
        val mockPage = mock<Page<Blob>>()
        whenever(mockPage.getValues()).thenReturn(listOf(blob))

        whenever(
            mockStorage.list(
                storageProperties.bucket,
                Storage.BlobListOption.pageSize(10000),
                Storage.BlobListOption.currentDirectory(),
                Storage.BlobListOption.prefix("foo/")
            )
        ).thenReturn(mockPage)

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
        whenever(mockStorage.get(storageProperties.bucket, blob.name)).thenReturn(blob)

        val mockChannel = mock<ReadChannel>()
        doReturn(mockChannel).whenever<Blob>(blob).reader()

        whenever(mockChannel.read(any())).thenAnswer(FakeReadAnswer())

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
        val mockWriteChannel = mock<WriteChannel>()
        whenever(mockWriteChannel.write(any())).thenAnswer { invocation ->
            val byteBuffer = invocation.getArgument<ByteBuffer>(0)
            byteBuffer.get(written, 0, byteBuffer.limit())
            written.size
        }
        whenever(mockStorage.writer(blobInfo)).thenReturn(mockWriteChannel)

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

        verify(mockStorage).delete(storageProperties.bucket, "foo/hello.txt")
    }

    private class FakeReadAnswer : Answer<Int> {
        private var count = 0

        override fun answer(invocation: InvocationOnMock): Int? {
            if (count == 0) {
                val buffer = invocation.getArgument<ByteBuffer>(0)
                buffer.put("hello".toByteArray(StandardCharsets.UTF_8))
                count++
                return "hello".length
            } else {
                return -1 // end of stream
            }
        }
    }
}
