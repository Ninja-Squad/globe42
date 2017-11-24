package org.globe42.dao;

import org.globe42.domain.Note;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for {@link Note}
 * @author JB Nizet
 */
public interface NoteDao extends JpaRepository<Note, Long> {
}
