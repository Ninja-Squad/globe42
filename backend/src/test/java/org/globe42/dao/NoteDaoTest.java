package org.globe42.dao;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import com.ninja_squad.dbsetup.Operations;
import com.ninja_squad.dbsetup.operation.Insert;
import com.ninja_squad.dbsetup.operation.Operation;
import org.globe42.domain.Note;
import org.globe42.domain.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests for {@link NoteDao}
 * @author JB Nizet
 */
public class NoteDaoTest extends BaseDaoTest {
    @Autowired
    private NoteDao dao;

    @Before
    public void prepare() {
        Operation users = Insert.into("guser")
                                .columns("id", "login", "password", "admin")
                                .values(1L, "jb", "hashedPassword", true)
                                .build();
        Operation notes = Insert.into("note")
                                .columns("id", "text", "creator_id", "creation_instant")
                                .values(1L, "test", 1L, Instant.parse("2017-08-04T00:00:00Z"))
                                .build();

        dbSetup(Operations.sequenceOf(users, notes));
    }

    @Test
    public void shouldResetCreator() {
        dao.resetCreatorOnNotesCreatedBy(new User(1L));
        Note note = dao.findById(1L).get();
        assertThat(note.getCreator()).isNull();
    }
}