package org.globe42.web.persons;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import javax.transaction.Transactional;

import com.google.common.io.ByteStreams;
import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.storage.FileDTO;
import org.globe42.storage.ReadableFile;
import org.globe42.storage.StorageService;
import org.globe42.web.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * REST controller used to handle files of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/persons/{personId}/files")
@Transactional
public class PersonFileController {

    private final PersonDao personDao;
    private final StorageService storageService;

    public PersonFileController(PersonDao personDao, StorageService storageService) {
        this.personDao = personDao;
        this.storageService = storageService;
    }

    @GetMapping
    public List<FileDTO> list(@PathVariable("personId") Long personId) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        String directory = person.getId().toString();
        return storageService.list(directory);
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<StreamingResponseBody> get(@PathVariable("personId") Long personId,
                                                     @PathVariable("fileName") String fileName) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        String directory = person.getId().toString();
        ReadableFile readableFile = storageService.get(directory, fileName);
        return ResponseEntity.status(HttpStatus.OK)
                             .contentLength(readableFile.getFile().getSize())
                             .contentType(MediaType.valueOf(readableFile.getFile().getContentType()))
                             .body(outputStream -> {
                                 try (InputStream in = readableFile.getInputStream()) {
                                     ByteStreams.copy(in, outputStream);
                                 }
                             });
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FileDTO create(@PathVariable("personId") Long personId,
                          @RequestParam("file") MultipartFile multipartFile) throws IOException {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        String directory = person.getId().toString();
        return storageService.create(directory,
                                     multipartFile.getOriginalFilename(),
                                     multipartFile.getContentType(),
                                     multipartFile.getInputStream());
    }

    @DeleteMapping("/{fileName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("personId") Long personId, @PathVariable("fileName") String fileName) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        String directory = person.getId().toString();
        storageService.delete(directory, fileName);
    }
}
