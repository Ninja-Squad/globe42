package org.globe42.web.reports

import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.xssf.usermodel.XSSFCellStyle
import org.apache.poi.xssf.usermodel.XSSFRow
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.globe42.dao.MembershipDao
import org.globe42.dao.PersonDao
import org.globe42.domain.*
import org.springframework.http.*
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.io.ByteArrayOutputStream
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import javax.transaction.Transactional

private val DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy")

/**
 * A controller used to generate reports
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/reports"])
@Transactional
class ReportController(private val personDao: PersonDao, private val membershipDao: MembershipDao) {

    @GetMapping("/appointments")
    fun appointmentReport(): ResponseEntity<ByteArray> {
        val persons = personDao.findNotDeletedWithMediation()

        val appointmentCreators =
            persons.asSequence()
                .flatMap { it.getNotes().asSequence() }
                .filter { note -> note.category == NoteCategory.APPOINTMENT }
                .map(Note::creator)
                .distinct()
                .sortedBy(User::login)
                .toList()

        val headers = listOf(
            "Prénom",
            "Nom",
            "Date de naissance",
            "Nationalité",
            "Sexe",
            "Accompagné",
            "Inscrit aux repas",
            "Inscrit aux cours de français - groupe 1",
            "Inscrit aux cours de français - groupe 2",
            "Inscrit aux cours de français - groupe 3",
            "Inscrit aux cours de français - groupe 4",
        ) + appointmentCreators.map { "Nb. de RDV par ${it.login}" }

        return createReport(
            fileNameWithoutExtension = "rendez-vous",
            sheetName = "Adhérents en médiation",
            headers = headers,
            elements = persons
        ) { row, person ->
            var col = 0
            row.createCell(col++, CellType.STRING).setCellValue(person.firstName)
            row.createCell(col++, CellType.STRING).setCellValue(person.lastName)
            row.createCell(col++, CellType.STRING).setCellValue(person.birthDate?.toReportString())
            row.createCell(col++, CellType.STRING).setCellValue(person.nationality?.name)
            row.createCell(col++, CellType.STRING).setCellValue(person.gender.reportValue)
            row.createCell(col++, CellType.BOOLEAN).setCellValue(!person.accompanying.isNullOrBlank())
            row.createCell(col++, CellType.BOOLEAN).setCellValue(person.getParticipations().any { it.activityType == ActivityType.MEAL })
            row.createCell(col++, CellType.BOOLEAN).setCellValue(person.getParticipations().any { it.activityType == ActivityType.FRENCH_AND_COMPUTER_LESSON_1 })
            row.createCell(col++, CellType.BOOLEAN).setCellValue(person.getParticipations().any { it.activityType == ActivityType.FRENCH_AND_COMPUTER_LESSON_2 })
            row.createCell(col++, CellType.BOOLEAN).setCellValue(person.getParticipations().any { it.activityType == ActivityType.FRENCH_AND_COMPUTER_LESSON_3 })
            row.createCell(col++, CellType.BOOLEAN).setCellValue(person.getParticipations().any { it.activityType == ActivityType.FRENCH_AND_COMPUTER_LESSON_4 })

            appointmentCreators.forEach { noteCreator ->
                row.createCell(col++, CellType.NUMERIC)
                    .setCellValue(person.getNotes().count {
                            note -> note.category == NoteCategory.APPOINTMENT && note.creator == noteCreator
                    }.toDouble())
            }
        }
    }

    @GetMapping("/memberships")
    fun membershipReport(): ResponseEntity<ByteArray> {
        val memberships = membershipDao.list()
        val headers = listOf(
            "Prénom",
            "Nom",
            "Date de naissance",
            "Sexe",
            "Email",
            "Date de paiement",
            "Mode de paiement",
            "Année d'adhésion",
            "N° de carte"
        )
        return createReport(
            fileNameWithoutExtension = "adhesions",
            sheetName = "Adhésions",
            headers = headers,
            elements = memberships
        ) { row, membership ->
            var col = 0
            row.createCell(col++, CellType.STRING).setCellValue(membership.person.firstName)
            row.createCell(col++, CellType.STRING).setCellValue(membership.person.lastName)
            row.createCell(col++, CellType.STRING).setCellValue(membership.person.birthDate?.toReportString())
            row.createCell(col++, CellType.STRING).setCellValue(membership.person.gender.reportValue)
            row.createCell(col++, CellType.STRING).setCellValue(membership.person.email)
            row.createCell(col++, CellType.STRING).setCellValue(membership.paymentDate.toReportString())
            row.createCell(col++, CellType.STRING).setCellValue(membership.paymentMode.reportValue)
            row.createCell(col++, CellType.NUMERIC).setCellValue(membership.year.toDouble())
            row.createCell(col, CellType.STRING).setCellValue(membership.cardNumber)
        }
    }

    @GetMapping("/missing-memberships")
    fun missingPaymentsReport(): ResponseEntity<ByteArray> {
        val persons = personDao.findMissingMembershipsForYear(LocalDate.now(ZoneId.of("Europe/Paris")).year)
        val headers = listOf(
            "Prénom",
            "Nom",
            "Date de naissance",
            "Sexe",
            "En médiation",
            "Email",
            "Téléphone"
        )

        return createReport(
            fileNameWithoutExtension = "adhesions-manquantes",
            sheetName = "Personnes sans adhésion",
            headers = headers,
            elements = persons
        ) { row, person ->
            var col = 0
            row.createCell(col++, CellType.STRING).setCellValue(person.firstName)
            row.createCell(col++, CellType.STRING).setCellValue(person.lastName)
            row.createCell(col++, CellType.STRING).setCellValue(person.birthDate?.toReportString())
            row.createCell(col++, CellType.STRING).setCellValue(person.gender.reportValue)
            row.createCell(col++, CellType.BOOLEAN).setCellValue(person.mediationEnabled)
            row.createCell(col++, CellType.STRING).setCellValue(person.email)
            row.createCell(col, CellType.STRING).setCellValue(person.phoneNumber)
        }
    }

    private fun <T> createReport(
        fileNameWithoutExtension: String,
        sheetName: String,
        headers: List<String>,
        elements: List<T>,
        rowPopulator: (XSSFRow, T) -> Unit
    ): ResponseEntity<ByteArray> {
        val out = ByteArrayOutputStream()
        XSSFWorkbook().use { workbook ->
            val sheet = workbook.createSheet(sheetName)

            val headerRow = sheet.createRow(0)
            headerRow.rowStyle = workbook.headerStyle
            headers.forEachIndexed { index, header ->
                headerRow.createCell(index, CellType.STRING).setCellValue(header)
            }
            sheet.createFreezePane(0, 1)

            elements.forEachIndexed { index, element ->
                val row = sheet.createRow(index + 1)
                rowPopulator(row, element)
            }

            headers.indices.forEach { sheet.autoSizeColumn(it) }

            workbook.write(out)
        }

        return out.toExcelResponse(fileNameWithoutExtension)
    }

    private fun LocalDate.toReportString() = format(DATE_FORMAT)

    private fun ByteArrayOutputStream.toExcelResponse(fileNameWithoutExtension: String): ResponseEntity<ByteArray> {
        val bytes = toByteArray()
        return ResponseEntity.status(HttpStatus.OK)
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .contentLength(bytes.size.toLong())
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition
                    .builder("attachment")
                    .filename("$fileNameWithoutExtension.xlsx")
                    .build()
                    .toString()
            )
            .body(bytes)
    }

    private val XSSFWorkbook.headerStyle: XSSFCellStyle
        get() {
            val headerStyle = createCellStyle()
            val font = headerStyle.font
            font.bold = true
            headerStyle.setFont(font)
            return headerStyle
        }

    private val Gender.reportValue: String
        get() = when (this) {
            Gender.MALE -> "M"
            Gender.FEMALE -> "F"
            Gender.OTHER -> "A"
        }

    private val PaymentMode.reportValue: String
        get() = when (this) {
            PaymentMode.CASH -> "Espèces"
            PaymentMode.CHECK -> "Chèque"
            PaymentMode.FREE -> "Gratuité"
            PaymentMode.OUT_OF_DATE -> "Pas à jour"
            PaymentMode.UNKNOWN -> "Inconnu"
        }
}
