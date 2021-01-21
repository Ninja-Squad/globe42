package org.globe42.web.reports

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import java.io.ByteArrayInputStream
import java.time.LocalDate
import java.time.ZoneId

/**
 * MVC tests for [ReportController]
 * @author JB Nizet
 */
@GlobeMvcTest(ReportController::class)
class ReportControllerMvcTest(@Autowired val mockMvc: MockMvc) {
    @MockkBean
    lateinit var personDao: PersonDao

    @MockkBean
    lateinit var membershipDao: MembershipDao

    @Test
    fun `should create appointments report`() {
        val malika = User().apply { login = "malika" }
        val alix = User().apply { login = "alix" }
        val admin = User().apply { login = "admin" }

        every { personDao.findNotDeletedWithMediation() } returns listOf(
            Person().apply {
                firstName = "Agnès"
                lastName = "Crepet"
                birthDate = LocalDate.of(1980, 2, 1)
                nationality = Country("FR", "France")
                gender = Gender.FEMALE
                accompanying = "someone"
                addParticipation(Participation().apply { activityType = ActivityType.FRENCH_AND_COMPUTER_LESSON })
                addParticipation(Participation().apply { activityType = ActivityType.MEAL })
                addNote(Note().apply {
                    creator = malika
                })
                addNote(Note().apply {
                    creator = admin
                    category = NoteCategory.OTHER
                })
            },
            Person().apply {
                firstName = "JB"
                lastName = "Nizet"
                birthDate = LocalDate.of(1975, 7, 19)
                nationality = Country("BE", "Belgique")
                gender = Gender.MALE
                accompanying = " "
                addNote(Note().apply {
                    creator = alix
                })
                addNote(Note().apply {
                    creator = alix
                })
                addNote(Note().apply {
                    creator = alix
                    category = NoteCategory.OTHER
                })
                addNote(Note().apply {
                    creator = malika
                    category = NoteCategory.OTHER
                })
            }
        )

        val result = mockMvc.get("/api/reports/appointments").andExpect {
            status { isOk() }
        }.andReturn()

        val bytes = result.response.contentAsByteArray

        XSSFWorkbook(ByteArrayInputStream(bytes)).use { workbook ->
            assertThat(workbook.numberOfSheets).isEqualTo(1)
            val sheet = workbook.getSheetAt(0)

            assertThat(sheet.lastRowNum).isEqualTo(2)
            sheet.rowIterator().forEach { row ->
                assertThat(row.lastCellNum).isEqualTo(10) // last cell num is the last cell num + 1
            }

            val agnesRow = sheet.getRow(1)
            assertThat(agnesRow.getCell(0).stringCellValue).isEqualTo("Agnès")
            assertThat(agnesRow.getCell(1).stringCellValue).isEqualTo("Crepet")
            assertThat(agnesRow.getCell(2).stringCellValue).isEqualTo("01/02/1980")
            assertThat(agnesRow.getCell(3).stringCellValue).isEqualTo("France")
            assertThat(agnesRow.getCell(4).stringCellValue).isEqualTo("F")
            assertThat(agnesRow.getCell(5).booleanCellValue).isTrue() // accompanied
            assertThat(agnesRow.getCell(6).booleanCellValue).isTrue() // meals
            assertThat(agnesRow.getCell(7).booleanCellValue).isTrue() // french
            assertThat(agnesRow.getCell(8).numericCellValue).isEqualTo(0.0) // alix
            assertThat(agnesRow.getCell(9).numericCellValue).isEqualTo(1.0) // malika

            val jbRow = sheet.getRow(2)
            assertThat(jbRow.getCell(5).booleanCellValue).isFalse() // accompanied
            assertThat(jbRow.getCell(6).booleanCellValue).isFalse() // meals
            assertThat(jbRow.getCell(7).booleanCellValue).isFalse() // french
            assertThat(jbRow.getCell(8).numericCellValue).isEqualTo(2.0) // alix
            assertThat(jbRow.getCell(9).numericCellValue).isEqualTo(0.0) // malika
        }
    }

    @Test
    fun `should create memberships report`() {
        every { membershipDao.list() } returns listOf(
            Membership(
                id = 1L,
                person = Person().apply {
                    firstName = "Agnès"
                    lastName = "Crepet"
                    birthDate = LocalDate.of(1980, 2, 1)
                    gender = Gender.FEMALE
                    email = "agnes@mail.com"
                },
                year = 2020,
                paymentMode = PaymentMode.CHECK,
                cardNumber = "12",
                paymentDate = LocalDate.of(2020, 1, 2)
            )
        )

        val result = mockMvc.get("/api/reports/memberships").andExpect {
            status { isOk() }
        }.andReturn()

        val bytes = result.response.contentAsByteArray

        XSSFWorkbook(ByteArrayInputStream(bytes)).use { workbook ->
            assertThat(workbook.numberOfSheets).isEqualTo(1)
            val sheet = workbook.getSheetAt(0)

            assertThat(sheet.lastRowNum).isEqualTo(1)
            sheet.rowIterator().forEach { row ->
                assertThat(row.lastCellNum).isEqualTo(9) // last cell num is the last cell num + 1
            }

            val row = sheet.getRow(1)
            assertThat(row.getCell(0).stringCellValue).isEqualTo("Agnès")
            assertThat(row.getCell(1).stringCellValue).isEqualTo("Crepet")
            assertThat(row.getCell(2).stringCellValue).isEqualTo("01/02/1980")
            assertThat(row.getCell(3).stringCellValue).isEqualTo("F")
            assertThat(row.getCell(4).stringCellValue).isEqualTo("agnes@mail.com")
            assertThat(row.getCell(5).stringCellValue).isEqualTo("02/01/2020")
            assertThat(row.getCell(6).stringCellValue).isEqualTo("Chèque")
            assertThat(row.getCell(7).numericCellValue).isEqualTo(2020.0)
            assertThat(row.getCell(8).stringCellValue).isEqualTo("12")
        }
    }

    @Test
    fun `should create missing payments report`() {
        every { personDao.findMissingMembershipsForYear(LocalDate.now(ZoneId.of("Europe/Paris")).year) } returns listOf(
            Person().apply {
                firstName = "Agnès"
                lastName = "Crepet"
                birthDate = LocalDate.of(1980, 2, 1)
                gender = Gender.FEMALE
                mediationEnabled = true
                email = "agnes@mail.com"
                phoneNumber = "0987654321"
            }
        )

        val result = mockMvc.get("/api/reports/missing-memberships").andExpect {
            status { isOk() }
        }.andReturn()

        val bytes = result.response.contentAsByteArray

        XSSFWorkbook(ByteArrayInputStream(bytes)).use { workbook ->
            assertThat(workbook.numberOfSheets).isEqualTo(1)
            val sheet = workbook.getSheetAt(0)

            assertThat(sheet.lastRowNum).isEqualTo(1)
            sheet.rowIterator().forEach { row ->
                assertThat(row.lastCellNum).isEqualTo(7) // last cell num is the last cell num + 1
            }

            val row = sheet.getRow(1)
            assertThat(row.getCell(0).stringCellValue).isEqualTo("Agnès")
            assertThat(row.getCell(1).stringCellValue).isEqualTo("Crepet")
            assertThat(row.getCell(2).stringCellValue).isEqualTo("01/02/1980")
            assertThat(row.getCell(3).stringCellValue).isEqualTo("F")
            assertThat(row.getCell(4).booleanCellValue).isEqualTo(true)
            assertThat(row.getCell(5).stringCellValue).isEqualTo("agnes@mail.com")
            assertThat(row.getCell(6).stringCellValue).isEqualTo("0987654321")
        }
    }
}
