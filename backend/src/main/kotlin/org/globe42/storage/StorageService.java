package org.globe42.storage;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UncheckedIOException;
import java.nio.channels.Channels;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.google.api.gax.paging.Page;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.common.io.ByteStreams;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

/**
 * Service used to wrap the Google cloud storage API
 * @author JB Nizet
 */
@Service
public class StorageService {

    static final String PERSON_FILES_BUCKET = "personfiles";

    private final Storage storage;

    public StorageService(Storage storage) {
        this.storage = storage;
    }

    /**
     * Lists the files in the given directory
     * @param directory the directory (serving as a prefix) to list the files
     * @return the list of files in the given directory. The directory prefix is stripped of from the names of the
     * returned files
     */
    public List<FileDTO> list(String directory) {
        final String prefix = toPrefix(directory);
        Page<Blob> page = storage.list(PERSON_FILES_BUCKET,
                                       Storage.BlobListOption.pageSize(10_000),
                                       Storage.BlobListOption.currentDirectory(),
                                       Storage.BlobListOption.prefix(prefix));
        return StreamSupport.stream(page.getValues().spliterator(), false)
            .map(blob -> new FileDTO(blob, prefix))
            .collect(Collectors.toList());
    }

    /**
     * Gets the given file in the given directory
     * @param directory the directory (serving as a prefix) of the file
     * @return the file in the given directory. The directory prefix is stripped of from the name of the
     * returned file
     */
    public ReadableFile get(String directory, String name) {
        String prefix = toPrefix(directory);
        Blob blob = storage.get(PERSON_FILES_BUCKET, prefix + name);
        return new ReadableFile(blob, prefix);
    }

    public FileDTO create(String directory,
                          String name,
                          String contentType,
                          InputStream data) {
        String prefix = toPrefix(directory);
        BlobId blobId = BlobId.of(PERSON_FILES_BUCKET, prefix + name);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM.toString();
        }
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
        try (OutputStream out = Channels.newOutputStream(storage.writer(blobInfo))) {
            ByteStreams.copy(data, out);
        }
        catch (IOException e) {
            throw new UncheckedIOException(e);
        }

        return new FileDTO(blobInfo, prefix);
    }

    public void delete(String directory, String name) {
        String prefix = toPrefix(directory);
        storage.delete(PERSON_FILES_BUCKET, prefix + name);
    }

    private String toPrefix(String directory) {
        return directory.endsWith("/") ? directory : directory + "/";
    }
}
