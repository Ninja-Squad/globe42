package org.globe42.web.reports

import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.xssf.usermodel.XSSFCellStyle
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

        val out = ByteArrayOutputStream()
        XSSFWorkbook().use { workbook ->
            val sheet = workbook.createSheet("Adhérents en médiation")

            val noteCreators =
                persons.asSequence()
                    .flatMap { it.getNotes().asSequence() }
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
                "Inscrit aux cours de français"
            ) + noteCreators.map { "Nb. de RDV par ${it.login}" }

            val headerRow = sheet.createRow(0)
            headerRow.rowStyle = workbook.headerStyle
            headers.forEachIndexed { index, header ->
                headerRow.createCell(index, CellType.STRING).setCellValue(header)
            }
            sheet.createFreezePane(0, 1)

            val accompaniedStatuses = setOf(MaritalStatus.MARRIED, MaritalStatus.CONCUBINAGE)
            persons.forEachIndexed { index, person ->
                val row = sheet.createRow(index + 1)
                var col = 0
                row.createCell(col++, CellType.STRING).setCellValue(person.firstName)
                row.createCell(col++, CellType.STRING).setCellValue(person.lastName)
                row.createCell(col++, CellType.STRING).setCellValue(person.birthDate?.toReportString())
                row.createCell(col++, CellType.STRING).setCellValue(person.nationality?.name)
                row.createCell(col++, CellType.STRING).setCellValue(person.gender.reportValue)
                row.createCell(col++, CellType.BOOLEAN).setCellValue(person.maritalStatus in accompaniedStatuses)
                row.createCell(col++, CellType.BOOLEAN)
                    .setCellValue(person.getParticipations().any { it.activityType == ActivityType.MEAL })
                row.createCell(col++, CellType.BOOLEAN).setCellValue(
                    person.getParticipations().any { it.activityType == ActivityType.FRENCH_AND_COMPUTER_LESSON })

                noteCreators.forEach { noteCreator ->
                    row.createCell(col++, CellType.NUMERIC)
                        .setCellValue(person.getNotes().count { it.creator == noteCreator }.toDouble())
                }
            }

            headers.indices.forEach { sheet.autoSizeColumn(it) }

            workbook.write(out)
        }

        return out.toExcelResponse("rendez-vous")
    }

    @GetMapping("/memberships")
    fun membershipReport(): ResponseEntity<ByteArray> {
        val memberships = membershipDao.list()

        val out = ByteArrayOutputStream()
        XSSFWorkbook().use { workbook ->
            val sheet = workbook.createSheet("Adhésions")

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

            val headerRow = sheet.createRow(0)
            headerRow.rowStyle = workbook.headerStyle
            headers.forEachIndexed { index, header ->
                headerRow.createCell(index, CellType.STRING).setCellValue(header)
            }
            sheet.createFreezePane(0, 1)

            memberships.forEachIndexed { index, membership ->
                val row = sheet.createRow(index + 1)
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

            headers.indices.forEach { sheet.autoSizeColumn(it) }

            workbook.write(out)
        }

        return out.toExcelResponse("adhesions")
    }

    private fun LocalDate.toReportString() = format(DATE_FORMAT)

    private fun ByteArrayOutputStream.toExcelResponse(filenameWithoutExtension: String): ResponseEntity<ByteArray> {
        val bytes = toByteArray()
        return ResponseEntity.status(HttpStatus.OK)
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .contentLength(bytes.size.toLong())
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition
                    .builder("attachment")
                    .filename("$filenameWithoutExtension.xlsx")
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
        get() = when(this) {
            Gender.MALE -> "M"
            Gender.FEMALE -> "F"
            Gender.OTHER -> "A"
        }

    private val PaymentMode.reportValue: String
        get() = when(this) {
            PaymentMode.CASH -> "Espèces"
            PaymentMode.CHECK -> "Chèque"
            PaymentMode.FREE -> "Gratuité"
            PaymentMode.OUT_OF_DATE -> "Pas à jour"
            PaymentMode.UNKNOWN -> "Inconnu"
        }
}
