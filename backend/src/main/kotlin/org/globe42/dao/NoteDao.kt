package org.globe42.dao

import org.globe42.domain.Note

/**
 * DAO for [Note]
 * @author JB Nizet
 */
interface NoteDao : GlobeRepository<Note, Long>
