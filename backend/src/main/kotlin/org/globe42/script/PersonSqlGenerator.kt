package org.globe42.script

import com.google.common.base.Strings
import java.io.BufferedReader
import java.io.InputStreamReader
import java.time.LocalDate
import java.time.format.DateTimeFormatterBuilder
import java.time.temporal.ChronoField
import java.util.*
import java.util.regex.Pattern
import java.util.stream.Collectors
import java.util.stream.Stream

/**
 * Generator used to generate the SQL script necessary to import the Excel file containing the members.
 *
 * To run that generator (which shouldn't be useful anymore):
 *
 *  * unhide the rows in the Excel file of persons
 *  * remove the empty rows
 *  * change the mediation code B9E to B9a
 *  * copy and paste all the rows except the title row to the file src/main/resources/persons.txt. When pasted from
 * OpenOffice, this seperates cells with a tab
 *  * change the birth date ending with 1963 into 63, to keep the same format in all rows
 *  * run the generator class
 *
 *
 * @author JB Nizet
 */
class PersonSqlGenerator(private val lines: Stream<String>) {

    private fun generate() {
        val rows: List<Row> = lines.map(::toRow).collect(Collectors.toList())

        val maxNumberByCharacter = mutableMapOf<Char, Int>()

        val mediationCodes = HashSet<String>()

        for (row in rows) {
            if (row.mediationCode != null) {
                maxNumberByCharacter.merge(row.mediationLetter!!, row.mediationNumber!!, Math::max)
            }

            println(toSqlInsert(row))

            if (row.mediationCode != null) {
                val added = mediationCodes.add(row.mediationCode)
                if (!added) {
                    println(row.lastName + " has a duplicate mediation code")
                }
            }
        }
        println()
        maxNumberByCharacter.forEach { character, number -> println(toSequenceUpdate(character, number)) }
    }

    private fun toSequenceUpdate(character: Char?, number: Int?): String {
        return "select setval('mediation_code_" + character + "_seq', " + number + ");"
    }

    private fun toSqlInsert(row: Row): String {
        val builder = StringBuilder()
        builder.append(
            """insert into person (id, first_name, last_name, gender, birth_date, phone_number, adherent,
                mediation_code, marital_status, housing, fiscal_status, fiscal_status_up_to_date, mediation_enabled,
                health_care_coverage) VALUES (nextval('person_seq'), '""".trimMargin()
        )
        builder.append(row.firstName)
        builder.append("', '")
        builder.append(row.lastName)
        builder.append("', 'OTHER', ")
        if (row.birthDate == null) {
            builder.append("NULL")
        } else {
            builder.append("'")
            builder.append(row.birthDate)
            builder.append("'")
        }
        builder.append(", ")
        if (row.phone == null) {
            builder.append("NULL")
        } else {
            builder.append("'")
            builder.append(row.phone)
            builder.append("'")
        }
        builder.append(", TRUE, ")
        if (row.mediationCode == null) {
            builder.append("NULL")
        } else {
            builder.append("'")
            builder.append(row.mediationCode)
            builder.append("'")
        }
        builder.append(", 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', FALSE, ")
        builder.append(if (row.mediationCode == null) "FALSE" else "TRUE")
        builder.append(", 'UNKNOWN');")

        return builder.toString()
    }

    private fun toRow(line: String): Row {
        val array = line.split(Pattern.quote("\t").toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()

        var mediationCode: String? = null
        if (array.size > 2 && !Strings.isNullOrEmpty(array[2])) {
            mediationCode = array[2].trim { it <= ' ' }
        }

        var phone: String? = null
        if (array.size > 3 && !Strings.isNullOrEmpty(array[3])) {
            phone = array[3].trim { it <= ' ' }
        }

        var birthDate: LocalDate? = null
        if (array.size > 4 && !Strings.isNullOrEmpty(array[4])) {
            val dateTimeFormatter = DateTimeFormatterBuilder().appendPattern("dd/MM/")
                .appendValueReduced(
                    ChronoField.YEAR,
                    2,
                    2,
                    1900
                )
                .toFormatter()

            birthDate = LocalDate.parse(array[4].trim { it <= ' ' }, dateTimeFormatter)
        }

        return Row(
            toName(array[0]),
            toName(array[1]),
            mediationCode,
            phone,
            birthDate
        )
    }

    private fun toName(s: String): String {
        var result = s.trim { it <= ' ' }.toLowerCase()
        result = Character.toUpperCase(result[0]) + result.substring(1)
        val dashIndex = result.indexOf('-')
        if (dashIndex >= 0) {
            result = (result.substring(0, dashIndex + 1)
                + Character.toUpperCase(result[dashIndex + 1])
                + result.substring(dashIndex + 2))
        }
        return result
    }

    private class Row(
        val lastName: String,
        val firstName: String,
        val mediationCode: String?,
        val phone: String?,
        val birthDate: LocalDate?
    ) {

        val mediationLetter: Char?
            get() = mediationCode?.get(0)

        val mediationNumber: Int?
            get() {
                return mediationCode?.let {
                    var suffix = mediationCode.substring(1)
                    if (suffix.endsWith("a")) {
                        suffix = suffix.substring(0, suffix.length - 1)
                    }
                    Integer.valueOf(suffix)
                }
            }
    }

    companion object {

        @JvmStatic
        fun main(args: Array<String>) {
            BufferedReader(
                InputStreamReader(
                    PersonSqlGenerator::class.java.getResourceAsStream("/persons.txt")
                )
            ).use { reader ->
                PersonSqlGenerator(reader.lines()).generate()
            }
        }
    }
}
