package org.globe42.storage

import com.google.cloud.storage.BlobInfo
import java.time.Instant

/**
 * Information about a file (stored in a Google Cloud Storage)
 * @author JB Nizet
 */
data class FileDTO(

    /**
     * The name of the file
     */
    val name: String,

    /**
     * The size of the file, in bytes
     */
    val size: Long?,

    /**
     * The instant when the file was created in the storage
     */
    val creationInstant: Instant,

    /**
     * The content type of the file
     */
    val contentType: String) {

    constructor(blob: BlobInfo, prefix: String): this(
            blob.name.substring(prefix.length),
            blob.size,
            if (blob.createTime == null) Instant.now() else Instant.ofEpochMilli(blob.createTime),
            blob.contentType
    )
}
