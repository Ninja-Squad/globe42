package org.globe42.storage

import com.google.cloud.storage.Blob
import java.io.InputStream
import java.nio.channels.Channels

/**
 * A file that can be read
 * @author JB Nizet
 */
open class ReadableFile(private val blob: Blob, prefix: String) {
    open val file: FileDTO = FileDTO(blob, prefix)

    open val inputStream: InputStream
        get() = Channels.newInputStream(this.blob.reader())
}
