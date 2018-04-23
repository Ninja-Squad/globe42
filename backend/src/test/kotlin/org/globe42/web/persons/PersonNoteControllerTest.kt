package org.globe42.web.persons

import com.nhaarman.mockito_kotlin.whenever
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.dao.UserDao
import org.globe42.domain.Gender
import org.globe42.domain.Note
import org.globe42.domain.Person
import org.globe42.domain.User
import org.globe42.test.BaseTest
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

/**
 * Unit tests for [PersonNoteController]
 * @author JB Nizet
 */
class PersonNoteControllerTest : BaseTest() {
    @Mock
    private lateinit var mockPersonDao: PersonDao

    @Mock
    private lateinit var mockCurrentUser: CurrentUser

    @Mock
    private lateinit var mockUserDao: UserDao

    @InjectMocks
    private lateinit var controller: PersonNoteController

    private lateinit var person: Person
    private lateinit var note1: Note
    private lateinit var note2: Note

    @BeforeEach
    fun prepare() {
        val creator = User(34L)
        creator.login = "JB"

        person = Person(42L, "John", "Doe", Gender.MALE)

        note1 = Note(1L)
        note1.text = "test"
        note1.creator = creator
        note1.creationInstant = Instant.now()
        person.addNote(note1)

        note2 = Note(2L)
        note2.text = "test2"
        note2.creator = creator
        note2.creationInstant = Instant.now().minus(1, ChronoUnit.DAYS)
        person.addNote(note2)

        whenever(mockCurrentUser.userId).thenReturn(creator.id)
        whenever(mockUserDao.getOne(creator.id!!)).thenReturn(creator)
    }

    @Test
    fun `should list`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        val result = controller.list(person.id!!)

        assertThat(result).hasSize(2)
        val (id, text, creator, creationInstant) = result[0]
        assertThat(id).isEqualTo(note2.id) // sorted chronologically
        assertThat(creationInstant).isEqualTo(note2.creationInstant)
        assertThat(text).isEqualTo(note2.text) // sorted chronologically
        assertThat(creator.id).isEqualTo(note2.creator!!.id) // sorted chronologically

        assertThat(result[1].creator.id).isEqualTo(creator.id)
    }

    @Test
    fun `should throw when listing for unknown person`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.list(person.id!!) }
    }

    @Test
    fun `should create`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        whenever(mockPersonDao.flush()).thenAnswer {
            val addedNote = person.getNotes().find({ it.text == "test3" })
            addedNote?.let { it.id = 3L }
            Unit
        }

        val command = NoteCommandDTO("test3")
        val result = controller.create(person.id!!, command)

        assertThat(person.getNotes()).hasSize(3)
        assertThat(person.getNotes().filter { note -> note.text == command.text }).isNotEmpty
        assertThat(result.creationInstant).isNotNull()
        assertThat(result.creator.id).isEqualTo(mockCurrentUser.userId)
    }

    @Test
    fun `should throw when creating for unknown person`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())
        val command = NoteCommandDTO("test3")

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.create(person.id!!, command)
        }
    }

    @Test
    fun `should update`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        val command = NoteCommandDTO("test3")
        controller.update(person.id!!, note1.id!!, command)

        assertThat(note1.text).isEqualTo(command.text)
    }

    @Test
    fun `should throw when updating for unknown person`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())
        val command = NoteCommandDTO("test3")

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, note1.id!!, command)
        }
    }

    @Test
    fun `should throw when updating unknown note`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())
        val command = NoteCommandDTO("test3")

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!,87654L, command)
        }
    }

    @Test
    fun `should delete`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))

        controller.delete(person.id!!, note1.id!!)

        assertThat(person.getNotes()).containsOnly(note2)
    }

    @Test
    fun `should throw when deleting for unknown person`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.empty())

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.delete(person.id!!, note1.id!!)
        }
    }

    @Test
    fun `should note throw when deleting unknown note`() {
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
        controller.delete(person.id!!, 876543L)
        assertThat(person.getNotes()).containsOnly(note1, note2)
    }
}