package org.globe42.dao

import org.globe42.domain.Note
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for [Note]
 * @author JB Nizet
 */
interface NoteDao : JpaRepository<Note, Long>
