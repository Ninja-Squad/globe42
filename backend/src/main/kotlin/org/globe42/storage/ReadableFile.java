package org.globe42.storage;

import java.io.InputStream;
import java.nio.channels.Channels;

import com.google.cloud.storage.Blob;

/**
 * A file that can be read
 * @author JB Nizet
 */
public class ReadableFile {
    private final FileDTO file;
    private final Blob blob;

    public ReadableFile(Blob blob, String prefix) {
        this.blob = blob;
        this.file = new FileDTO(blob, prefix);
    }

    public InputStream getInputStream() {
        return Channels.newInputStream(this.blob.reader());
    }

    public FileDTO getFile() {
        return file;
    }
}
