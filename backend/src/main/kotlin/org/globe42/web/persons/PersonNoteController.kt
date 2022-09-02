package org.globe42.web.persons

import org.globe42.dao.PersonDao
import org.globe42.dao.UserDao
import org.globe42.domain.Note
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.stream.Collectors
import javax.transaction.Transactional

/**
 * REST controller used to handle notes of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/persons/{personId}/notes"])
@Transactional
class PersonNoteController(
    private val personDao: PersonDao,
    private val currentUser: CurrentUser,
    private val userDao: UserDao
) {

    @GetMapping
    fun list(@PathVariable("personId") personId: Long): List<NoteDTO> {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        return person.getNotes()
            .stream()
            .sorted(Comparator.comparing(Note::creationInstant).reversed())
            .map(::NoteDTO)
            .collect(Collectors.toList())
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@PathVariable("personId") personId: Long, @Validated @RequestBody command: NoteCommandDTO): NoteDTO {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()

        val note = Note()
        note.creator = userDao.getReferenceById(currentUser.userId!!)
        note.text = command.text
        note.category = command.category
        person.addNote(note)

        personDao.flush()

        return NoteDTO(note)
    }

    @PutMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(
        @PathVariable("personId") personId: Long,
        @PathVariable("noteId") noteId: Long,
        @Validated @RequestBody command: NoteCommandDTO
    ) {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        val note = person.getNotes()
            .stream()
            .filter { n -> n.id == noteId }
            .findAny()
            .orElseThrow(::NotFoundException)
        note.text = command.text
        note.category = command.category
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable("personId") personId: Long,
        @PathVariable("noteId") noteId: Long
    ) {
        val person = personDao.findByIdOrNull(personId) ?: throw NotFoundException()
        person.getNotes()
            .stream()
            .filter { n -> n.id == noteId }
            .findAny()
            .ifPresent { person.removeNote(it) }
    }
}
