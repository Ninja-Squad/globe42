package org.globe42.storage;

import java.time.Instant;

import com.google.cloud.storage.BlobInfo;

/**
 * Information about a file (stored in a Google Cloud Storage)
 * @author JB Nizet
 */
public final class FileDTO {

    /**
     * The name of the file
     */
    private final String name;

    /**
     * The size of the file, in bytes
     */
    private final Long size;

    /**
     * The instant when the file was created in the storage
     */
    private final Instant creationInstant;

    /**
     * The content type of the file
     */
    private final String contentType;

    public FileDTO(BlobInfo blob, String prefix) {
        this.name = blob.getName().substring(prefix.length());
        this.size = blob.getSize();
        this.creationInstant = blob.getCreateTime() == null ? Instant.now() : Instant.ofEpochMilli(blob.getCreateTime());
        this.contentType = blob.getContentType();
    }

    public FileDTO(String name, Long size, Instant creationInstant, String contentType) {
        this.name = name;
        this.size = size;
        this.creationInstant = creationInstant;
        this.contentType = contentType;
    }

    public String getName() {
        return name;
    }

    public Long getSize() {
        return size;
    }

    public Instant getCreationInstant() {
        return creationInstant;
    }

    public String getContentType() {
        return contentType;
    }
}
