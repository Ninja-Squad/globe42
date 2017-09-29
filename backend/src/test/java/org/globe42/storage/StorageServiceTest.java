package org.globe42.storage;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import com.google.api.gax.paging.Page;
import com.google.cloud.ReadChannel;
import com.google.cloud.WriteChannel;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.common.io.ByteStreams;
import org.globe42.test.BaseTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

/**
 * Unit tests for {@link StorageService}
 * @author JB Nizet
 */
public class StorageServiceTest extends BaseTest {
    @Mock
    private Storage mockStorage;

    @InjectMocks
    private StorageService service;

    private Blob blob;

    @Before
    public void prepare() {
        blob = mock(Blob.class);
        doReturn("foo/hello.txt").when(blob).getName();
        doReturn(5L).when(blob).getSize();
        doReturn("text/plain").when(blob).getContentType();
        long createTime = System.currentTimeMillis() - 100000L;
        doReturn(createTime).when(blob).getCreateTime();
    }

    @SuppressWarnings("unchecked")
    @Test
    public void shouldList() {
        Page<Blob> mockPage = mock(Page.class);
        when(mockPage.getValues()).thenReturn(Collections.singletonList(blob));

        when(mockStorage.list(StorageService.PERSON_FILES_BUCKET,
                              Storage.BlobListOption.pageSize(10_000),
                              Storage.BlobListOption.currentDirectory(),
                              Storage.BlobListOption.prefix("foo/"))).thenReturn(mockPage);

        List<FileDTO> result = service.list("foo");

        assertThat(result).hasSize(1);
        FileDTO file = result.get(0);
        assertThat(file.getContentType()).isEqualTo(blob.getContentType());
        assertThat(file.getSize()).isEqualTo(blob.getSize());
        assertThat(file.getCreationInstant()).isEqualTo(Instant.ofEpochMilli(blob.getCreateTime()));
        assertThat(file.getName()).isEqualTo("hello.txt");
    }

    @Test
    public void shouldGet() throws IOException {
        when(mockStorage.get(StorageService.PERSON_FILES_BUCKET, blob.getName())).thenReturn(blob);

        ReadChannel mockChannel = mock(ReadChannel.class);
        doReturn(mockChannel).when(blob).reader();

        when(mockChannel.read(any(ByteBuffer.class))).thenAnswer(new FakeReadAnswer());

        ReadableFile result = service.get("foo", "hello.txt");

        FileDTO file = result.getFile();
        assertThat(file.getContentType()).isEqualTo(blob.getContentType());
        assertThat(file.getSize()).isEqualTo(blob.getSize());
        assertThat(file.getCreationInstant()).isEqualTo(Instant.ofEpochMilli(blob.getCreateTime()));
        assertThat(file.getName()).isEqualTo("hello.txt");
        byte[] bytes = ByteStreams.toByteArray(result.getInputStream());
        assertThat(bytes).isEqualTo("hello".getBytes(StandardCharsets.UTF_8));
    }

    @Test
    public void shouldCreate() throws IOException {
        BlobInfo blobInfo =
            BlobInfo.newBuilder(StorageService.PERSON_FILES_BUCKET, "foo/new.txt")
                    .setContentType("text/plain")
                    .build();

        byte[] written = new byte[7];
        WriteChannel mockWriteChannel = mock(WriteChannel.class);
        when(mockWriteChannel.write(any(ByteBuffer.class))).thenAnswer(invocation -> {
            ByteBuffer byteBuffer = invocation.getArgument(0);
            byteBuffer.get(written, 0, byteBuffer.limit());
            return written.length;
        });
        when(mockStorage.writer(blobInfo)).thenReturn(mockWriteChannel);

        FileDTO result = service.create("foo", "new.txt", "text/plain", new ByteArrayInputStream("goodbye".getBytes(StandardCharsets.UTF_8)));
        assertThat(result.getName()).isEqualTo("new.txt");
        assertThat(result.getCreationInstant()).isNotNull();
        assertThat(result.getContentType()).isEqualTo("text/plain");
        assertThat(written).isEqualTo("goodbye".getBytes(StandardCharsets.UTF_8));
    }

    @Test
    public void shouldDelete() {
        service.delete("foo", "hello.txt");

        verify(mockStorage).delete(StorageService.PERSON_FILES_BUCKET, "foo/hello.txt");
    }

    private static class FakeReadAnswer implements Answer<Integer> {
        private int count = 0;

        @Override
        public Integer answer(InvocationOnMock invocation) throws Throwable {
            if (count == 0) {
                ByteBuffer buffer = invocation.getArgument(0);
                buffer.put("hello".getBytes(StandardCharsets.UTF_8));
                count++;
                return "hello".length();
            }
            else {
                return -1; // end of stream
            }
        }
    }
}
