package org.globe42.web.persons

import com.itextpdf.io.image.ImageDataFactory
import com.itextpdf.kernel.geom.PageSize
import com.itextpdf.kernel.pdf.PdfDocument
import com.itextpdf.kernel.pdf.PdfWriter
import com.itextpdf.layout.Document
import com.itextpdf.layout.borders.Border
import com.itextpdf.layout.borders.DottedBorder
import com.itextpdf.layout.borders.SolidBorder
import com.itextpdf.layout.element.Cell
import com.itextpdf.layout.element.Div
import com.itextpdf.layout.element.Image
import com.itextpdf.layout.element.Paragraph
import com.itextpdf.layout.element.Table
import com.itextpdf.layout.element.Text
import com.itextpdf.layout.properties.TextAlignment
import com.itextpdf.layout.properties.UnitValue
import org.globe42.domain.Person
import org.springframework.stereotype.Component
import java.io.OutputStream
import java.time.format.DateTimeFormatter

private const val ONE_MILLIMETER = 2.8346456692913f


/**
 * Component allowing to generate a pre-filled PDF membership form
 * @author JB Nizet
 */
@Component
class MembershipFormGenerator {
    fun generate(person: Person, out: OutputStream) {
        val pdfWriter = PdfWriter(out)
        val pdfDoc = PdfDocument(pdfWriter)
        Document(pdfDoc, PageSize.A4).use { doc ->
            doc
                .add(createHeader())
                .add(createTitle())
                .add(createSubTitle())
                .add(createForm(person))
                .add(createMembershipSection())
                .add(createPaymentSection())
                .add(createQuestionSection())
                .add(createSignatureForm())
                .add(createFooter())
        }
    }

    private fun createHeader(): Table {
        return Table(
            arrayOf<UnitValue>(
                UnitValue.createPercentValue(50f),
                UnitValue.createPercentValue(50f)
            )
        )
            .useAllAvailableWidth()
            .setBorder(Border.NO_BORDER)
            .addCell(createLeftHeaderCell())
            .addCell(createRightHeaderCell())
            .setMarginBottom(12f)
    }

    private fun createLeftHeaderCell(): Cell {
        return noBorderCell()
            .add(Image(ImageDataFactory.create(this.javaClass.getResource("/images/logo.png"))).scaleToFit(100 * ONE_MILLIMETER, 30 * ONE_MILLIMETER))
    }

    private fun createRightHeaderCell(): Cell {
        return noBorderCell()
            .add(Paragraph("N° de pièce comptable"))
            .add(
                Div()
                    .setHeight(15 * ONE_MILLIMETER)
                    .setBorder(SolidBorder(0.5f))
            )
    }

    private fun createTitle(): Paragraph {
        return Paragraph("Fiche d'adhésion")
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(24f)
    }

    private fun createSubTitle(): Paragraph {
        return Paragraph("Je déclare avoir pris connaissance des statuts de l’association GLOBE 42")
            .setTextAlignment(TextAlignment.CENTER)
            .setBold()
    }

    private fun createForm(person: Person): Table {
        fun labelCell(text: String) = noBorderCell().setTextAlignment(TextAlignment.RIGHT).add(Paragraph(text))
        fun fieldCell(text: String?, colspan: Int = 1) =
            noBorderCell(colspan).setBorderBottom(DottedBorder(0.5f)).add(Paragraph(text.orEmpty().ifBlank { "\u00a0" }))

        return Table(
            arrayOf<UnitValue>(
                UnitValue.createPercentValue(15f),
                UnitValue.createPercentValue(35f),
                UnitValue.createPercentValue(15f),
                UnitValue.createPercentValue(35f)
            )
        )
            .useAllAvailableWidth()
            .setBorder(Border.NO_BORDER)
            .setMarginTop(10 * ONE_MILLIMETER)
            .setMarginBottom(10 * ONE_MILLIMETER)
            .addCell(labelCell("Nom : "))
            .addCell(fieldCell(person.lastName.uppercase()))
            .addCell(labelCell("Prénom : "))
            .addCell(fieldCell(person.firstName.uppercase()))
            .addCell(labelCell("Né·e le : "))
            .addCell(fieldCell(person.birthDate?.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))))
            .addCell(labelCell("à : "))
            .addCell(fieldCell(null))
            .addCell(labelCell("Adresse : "))
            .addCell(fieldCell(person.address, colspan = 3))
            .addCell(labelCell(""))
            .addCell(fieldCell(listOf(person.city?.code, person.city?.city).filterNotNull().joinToString(separator = " "), colspan = 3))
            .addCell(labelCell("Email : "))
            .addCell(fieldCell(person.email, colspan = 3))
            .addCell(labelCell("Téléphone : "))
            .addCell(fieldCell(person.phoneNumber, colspan = 3))
    }

    private fun createMembershipSection(): Div {
        return Div()
            .add(
                Paragraph()
                    .add(Text("Je souhaite adhérer à l’association GLOBE 42.\n").setBold())
                    .add("Cotisation annuelle : 5 euros ")
                    .add(Text("(renouvellement à la date de l’Assemblée Générale annuelle)").setItalic())
            )
    }

    private fun createPaymentSection(): Div {
        fun choice() = Paragraph().setMarginLeft(15 * ONE_MILLIMETER).add(Div().setBorder(SolidBorder(0.5f)).setFillAvailableArea(false).setWidth(8f).setHeight(8f).setMarginRight(8f))
        return Div()
            .add(Paragraph("Ci-joint mon règlement :"))
            .add(choice().add("En espèces"))
            .add(choice().add("Par chèque à l’ordre de : ").add(Text("Espace Social et de Santé Participatif GLOBE 42").setBold()))
    }

    private fun createQuestionSection(): Div {
        fun field() = Paragraph("\u00a0").setBorderBottom(DottedBorder(0.5f))
        return Div()
            .setMarginTop(10 * ONE_MILLIMETER)
            .add(Paragraph("Comment avez-vous connu GLOBE 42 ?"))
            .add(field())
            .add(field())
    }

    private fun createSignatureForm(): Table {
        fun labelCell(text: String) = noBorderCell().setTextAlignment(TextAlignment.RIGHT).add(Paragraph(text))
        fun fieldCell() =
            noBorderCell().setBorderBottom(DottedBorder(0.5f)).add(Paragraph(""))

        return Table(
            arrayOf<UnitValue>(
                UnitValue.createPercentValue(15f),
                UnitValue.createPercentValue(35f),
                UnitValue.createPercentValue(15f),
                UnitValue.createPercentValue(35f)
            )
        )
            .useAllAvailableWidth()
            .setBorder(Border.NO_BORDER)
            .setMarginTop(10 * ONE_MILLIMETER)
            .addCell(labelCell("Date : "))
            .addCell(fieldCell())
            .addCell(labelCell("Signature : "))
            .addCell(fieldCell().setBorderBottom(Border.NO_BORDER))
    }

    private fun createFooter(): Div {
        return Div()
            .setMarginTop(20 * ONE_MILLIMETER)
            .add(
                Paragraph()
                    .add("Les informations recueillies, nécessaires pour votre adhésion, font l’objet d’un traitement informatique conforme aux articles 39 et suivants de la ")
                    .add(Text("Loi du 6 janvier 1978 modifiée").setUnderline())
                    .add(". En application de ces articles, vous bénéficiez d’un droit d’accès et de rectification des informations vous concernant. Si vous souhaitez exercer ce droit et obtenir communication de ces informations, merci de vous adresser à la / au secrétaire.")
            ).setFontSize(9f).setTextAlignment(TextAlignment.JUSTIFIED)
    }

    fun noBorderCell(colspan: Int = 1) = Cell(1, colspan).setBorder(Border.NO_BORDER)
}
