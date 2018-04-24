package org.globe42.storage

import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import com.google.common.io.ByteStreams
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import java.io.IOException
import java.io.InputStream
import java.io.UncheckedIOException
import java.nio.channels.Channels

internal const val PERSON_FILES_BUCKET = "personfiles"

/**
 * Service used to wrap the Google cloud storage API
 * @author JB Nizet
 */
@Service
class StorageService(private val storage: Storage) {

    /**
     * Lists the files in the given directory
     * @param directory the directory (serving as a prefix) to list the files
     * @return the list of files in the given directory. The directory prefix is stripped of from the names of the
     * returned files
     */
    fun list(directory: String): List<FileDTO> {
        val prefix = directory.endingWithSlash()
        val page = storage.list(PERSON_FILES_BUCKET,
                                Storage.BlobListOption.pageSize(10000),
                                Storage.BlobListOption.currentDirectory(),
                                Storage.BlobListOption.prefix(prefix))
        return page.values
                .map { blob -> FileDTO(blob, prefix) }
                .toList()
    }

    /**
     * Gets the given file in the given directory
     * @param directory the directory (serving as a prefix) of the file
     * @return the file in the given directory. The directory prefix is stripped of from the name of the
     * returned file
     */
    fun get(directory: String, name: String): ReadableFile {
        val prefix = directory.endingWithSlash()
        val blob = storage.get(PERSON_FILES_BUCKET, prefix + name)
        return ReadableFile(blob, prefix)
    }

    fun create(directory: String,
               name: String,
               contentType: String?,
               data: InputStream): FileDTO {
        val prefix = directory.endingWithSlash()
        val blobId = BlobId.of(PERSON_FILES_BUCKET, prefix + name)
        val blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType ?: MediaType.APPLICATION_OCTET_STREAM.toString())
                .build()
        try {
            Channels.newOutputStream(storage.writer(blobInfo)).use { out -> ByteStreams.copy(data, out) }
        } catch (e: IOException) {
            throw UncheckedIOException(e)
        }

        return FileDTO(blobInfo, prefix)
    }

    fun delete(directory: String, name: String) {
        val prefix = directory.endingWithSlash()
        storage.delete(PERSON_FILES_BUCKET, prefix + name)
    }

    private fun String.endingWithSlash(): String {
        return if (endsWith("/")) this else "$this/"
    }
}
