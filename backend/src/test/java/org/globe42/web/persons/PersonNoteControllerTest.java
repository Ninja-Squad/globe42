package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.dao.UserDao;
import org.globe42.domain.Note;
import org.globe42.domain.Person;
import org.globe42.domain.User;
import org.globe42.test.BaseTest;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.CurrentUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link PersonNoteController}
 * @author JB Nizet
 */
public class PersonNoteControllerTest extends BaseTest {
    @Mock
    private PersonDao mockPersonDao;

    @Mock
    private CurrentUser mockCurrentUser;

    @Mock
    private UserDao mockUserDao;

    @InjectMocks
    private PersonNoteController controller;

    private Person person;
    private Note note1;
    private Note note2;

    @BeforeEach
    public void prepare() {
        User creator = new User(34L);
        creator.setLogin("JB");

        person = new Person(42L);

        note1 = new Note(1L);
        note1.setText("test");
        note1.setCreator(null);
        note1.setCreationInstant(Instant.now());
        person.addNote(note1);

        note2 = new Note(2L);
        note2.setText("test2");
        note2.setCreator(creator);
        note2.setCreationInstant(Instant.now().minus(1, ChronoUnit.DAYS));
        person.addNote(note2);

        when(mockCurrentUser.getUserId()).thenReturn(creator.getId());
        when(mockUserDao.getOne(creator.getId())).thenReturn(creator);
    }

    @Test
    public void shouldList() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        List<NoteDTO> result = controller.list(person.getId());

        assertThat(result).hasSize(2);
        NoteDTO firstNote = result.get(0);
        assertThat(firstNote.getId()).isEqualTo(note2.getId()); // sorted chronologically
        assertThat(firstNote.getCreationInstant()).isEqualTo(note2.getCreationInstant());
        assertThat(firstNote.getText()).isEqualTo(note2.getText()); // sorted chronologically
        assertThat(firstNote.getCreator().getId()).isEqualTo(note2.getCreator().getId()); // sorted chronologically

        assertThat(result.get(1).getCreator()).isNull();
    }

    @Test
    public void shouldThrowWhenListingForUnknownPerson() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.list(person.getId()));
    }

    @Test
    public void shouldCreate() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        NoteCommandDTO command = new NoteCommandDTO("test3");
        NoteDTO result = controller.create(person.getId(), command);

        assertThat(person.getNotes()).hasSize(3);
        assertThat(person.getNotes().stream().filter(note -> note.getText().equals(command.getText())).findAny()).isPresent();
        assertThat(result.getCreationInstant()).isNotNull();
        assertThat(result.getCreator().getId()).isEqualTo(mockCurrentUser.getUserId());
    }

    @Test
    public void shouldThrowWhenCreatingForUnknownPerson() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());
        NoteCommandDTO command = new NoteCommandDTO("test3");

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> controller.create(person.getId(), command));
    }

    @Test
    public void shouldUpdate() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        NoteCommandDTO command = new NoteCommandDTO("test3");
        controller.update(person.getId(), note1.getId(), command);

        assertThat(note1.getText()).isEqualTo(command.getText());
    }

    @Test
    public void shouldThrowWhenUpdatingForUnknownPerson() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());
        NoteCommandDTO command = new NoteCommandDTO("test3");

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(
            () -> controller.update(person.getId(), note1.getId(), command));
    }

    @Test
    public void shouldThrowWhenUpdatingUnknownNote() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());
        NoteCommandDTO command = new NoteCommandDTO("test3");

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(
            () -> controller.update(person.getId(), 87654L, command));
    }

    @Test
    public void shouldDelete() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));

        controller.delete(person.getId(), note1.getId());

        assertThat(person.getNotes()).containsOnly(note2);
    }

    @Test
    public void shouldThrowWhenDeletingForUnknownPerson() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class).isThrownBy(
            () -> controller.delete(person.getId(), note1.getId()));
    }

    @Test
    public void shouldNoteThrowWhenDeletingUnknownNote() {
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
        controller.delete(person.getId(), 876543L);
        assertThat(person.getNotes()).containsOnly(note1, note2);
    }
}