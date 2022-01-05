package org.globe42.web.persons

import org.assertj.core.api.Assertions.assertThat
import org.globe42.domain.City
import org.globe42.domain.Person
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import java.io.File
import java.io.FileOutputStream
import java.time.LocalDate

/**
 * Tests for [MembershipFormGenerator]
 * @author JB Nizet
 */
class MembershipFormGeneratorTest {
    @Test
    fun `should generate a form`(@TempDir tempDirectory: File) {
        val person = Person().apply {
            firstName = "Jean-Baptiste"
            lastName = "Nizet"
            birthDate = LocalDate.parse("1975-07-19")
            address = "13, lot. des Tilleuls"
            city = City("42170", "St Just St Rambert")
            email = "jb@ninja-squad.com"
            phoneNumber = "04 77 36 49 52"
        }
        val generator = MembershipFormGenerator()
        val file = tempDirectory.resolve("form.pdf")
        FileOutputStream(file).use {
            generator.generate(person, it)
        }
        assertThat(file).isNotEmpty()
        // uncomment this to open the generated file to test your changes while developing
        // Desktop.getDesktop().open(file)
    }
}
