package org.globe42.web.persons

import javax.validation.constraints.NotEmpty

/**
 * Command sent to create a note
 * @author JB Nizet
 */
data class NoteCommandDTO(@field:NotEmpty val text: String)
