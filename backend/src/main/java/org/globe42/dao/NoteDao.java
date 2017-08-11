package org.globe42.dao;

import org.globe42.domain.Note;
import org.globe42.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * DAO for {@link Note}
 * @author JB Nizet
 */
public interface NoteDao extends JpaRepository<Note, Long> {
    @Query("update Task task set task.creator = null where task.creator = :user")
    @Modifying
    void resetCreatorOnNotesCreatedBy(@Param("user") User user);
}
