package org.globe42.web.persons

import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatExceptionOfType
import org.globe42.dao.PersonDao
import org.globe42.dao.UserDao
import org.globe42.domain.Gender
import org.globe42.domain.Note
import org.globe42.domain.Person
import org.globe42.domain.User
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.CurrentUser
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.temporal.ChronoUnit

/**
 * Unit tests for [PersonNoteController]
 * @author JB Nizet
 */
class PersonNoteControllerTest {
    private val mockPersonDao = mockk<PersonDao>()

    private val mockCurrentUser = mockk<CurrentUser>()

    private val mockUserDao = mockk<UserDao>()

    private val controller = PersonNoteController(mockPersonDao, mockCurrentUser, mockUserDao)

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

        every { mockCurrentUser.userId } returns creator.id
        every { mockUserDao.getOne(creator.id!!) } returns creator
    }

    @Test
    fun `should list`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        val result = controller.list(person.id!!)

        assertThat(result).hasSize(2)
        val (id, text, creator, creationInstant) = result[1]
        assertThat(id).isEqualTo(note2.id) // sorted anti-chronologically
        assertThat(creationInstant).isEqualTo(note2.creationInstant)
        assertThat(text).isEqualTo(note2.text) // sorted chronologically
        assertThat(creator.id).isEqualTo(note2.creator.id) // sorted chronologically

        assertThat(result[0].creator.id).isEqualTo(creator.id)
    }

    @Test
    fun `should throw when listing for unknown person`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy { controller.list(person.id!!) }
    }

    @Test
    fun `should create`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        every { mockPersonDao.flush() } answers {
            val addedNote = person.getNotes().find { it.text == "test3" }
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
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null
        val command = NoteCommandDTO("test3")

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.create(person.id!!, command)
        }
    }

    @Test
    fun `should update`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        val command = NoteCommandDTO("test3")
        controller.update(person.id!!, note1.id!!, command)

        assertThat(note1.text).isEqualTo(command.text)
    }

    @Test
    fun `should throw when updating for unknown person`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null
        val command = NoteCommandDTO("test3")

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, note1.id!!, command)
        }
    }

    @Test
    fun `should throw when updating unknown note`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null
        val command = NoteCommandDTO("test3")

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.update(person.id!!, 87654L, command)
        }
    }

    @Test
    fun `should delete`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person

        controller.delete(person.id!!, note1.id!!)

        assertThat(person.getNotes()).containsOnly(note2)
    }

    @Test
    fun `should throw when deleting for unknown person`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns null

        assertThatExceptionOfType(NotFoundException::class.java).isThrownBy {
            controller.delete(person.id!!, note1.id!!)
        }
    }

    @Test
    fun `should note throw when deleting unknown note`() {
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
        controller.delete(person.id!!, 876543L)
        assertThat(person.getNotes()).containsOnly(note1, note2)
    }
}
