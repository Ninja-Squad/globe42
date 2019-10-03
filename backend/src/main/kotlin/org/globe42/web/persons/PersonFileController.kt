package org.globe42.web.persons

import com.google.common.io.ByteStreams
import org.globe42.dao.PersonDao
import org.globe42.storage.FileDTO
import org.globe42.storage.StorageService
import org.globe42.web.exception.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import javax.transaction.Transactional

/**
 * REST controller used to handle files of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/files"])
@Transactional
class PersonFileController(private val personDao: PersonDao, private val storageService: StorageService) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long): List<FileDTO> {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val directory = person.id!!.toString()
        return storageService.list(directory)
    }

    @GetMapping("/{fileName}")
    fun get(
        @PathVariable("personId") personId: Long,
        @PathVariable("fileName") fileName: String
    ): ResponseEntity<StreamingResponseBody> {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val directory = person.id!!.toString()
        val readableFile = storageService.get(directory, fileName)
        val responseBody = StreamingResponseBody { outputStream ->
            readableFile.inputStream.use { input ->
                ByteStreams.copy(input, outputStream)
            }
        }
        return ResponseEntity.status(HttpStatus.OK)
            .contentLength(readableFile.file.size!!)
            .contentType(MediaType.valueOf(readableFile.file.contentType))
            .body(responseBody)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable("personId") personId: Long,
        @RequestParam("file") multipartFile: MultipartFile
    ): FileDTO {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val directory = person.id.toString()
        return storageService.create(
            directory,
            multipartFile.originalFilename!!,
            multipartFile.contentType,
            multipartFile.inputStream
        )
    }

    @DeleteMapping("/{fileName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("personId") personId: Long, @PathVariable("fileName") fileName: String) {
        val person = personDao.findById(personId).orElseThrow(::NotFoundException)
        val directory = person.id!!.toString()
        storageService.delete(directory, fileName)
    }
}
