package org.globe42.web.persons;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PersonDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.Note;
import org.globe42.domain.Person;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to handle notes of a person
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/persons/{personId}/notes")
@Transactional
public class PersonNoteController {

    private final PersonDao personDao;
    private final CurrentUser currentUser;
    private final UserDao userDao;

    public PersonNoteController(PersonDao personDao, CurrentUser currentUser, UserDao userDao) {
        this.personDao = personDao;
        this.currentUser = currentUser;
        this.userDao = userDao;
    }

    @GetMapping
    public List<NoteDTO> list(@PathVariable("personId") Long personId) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        return person.getNotes()
                     .stream()
                     .sorted(Comparator.comparing(Note::getCreationInstant))
                     .map(NoteDTO::new)
                     .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteDTO create(@PathVariable("personId") Long personId, @Validated @RequestBody NoteCommandDTO command) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);

        Note note = new Note();
        note.setCreationInstant(Instant.now());
        note.setCreator(userDao.getOne(currentUser.getUserId()));
        note.setText(command.getText());
        person.addNote(note);

        personDao.flush();

        return new NoteDTO(note);
    }

    @PutMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable("personId") Long personId,
                       @PathVariable("noteId") Long noteId,
                       @Validated @RequestBody NoteCommandDTO command) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        Note note = person.getNotes()
                          .stream()
                          .filter(n -> n.getId().equals(noteId))
                          .findAny().orElseThrow(NotFoundException::new);
        note.setText(command.getText());
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("personId") Long personId,
                       @PathVariable("noteId") Long noteId) {
        Person person = personDao.findById(personId).orElseThrow(NotFoundException::new);
        person.getNotes()
              .stream()
              .filter(n -> n.getId().equals(noteId))
              .findAny()
              .ifPresent(person::removeNote);
    }
}
