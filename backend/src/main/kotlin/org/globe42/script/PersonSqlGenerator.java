package org.globe42.script;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.google.common.base.Strings;

/**
 * Generator used to generate the SQL script necessary to import the Excel file containing the members.
 *
 * To run that generator (which shouldn't be useful anymore):
 * <ul>
 *   <li>>unhide the rows in the Excel file of persons</li>
 *   <li>remove the empty rows</li>
 *   <li>change the mediation code B9E to B9a</li>
 *   <li>copy and paste all the rows except the title row to the file src/main/resources/persons.txt. When pasted from
 *       OpenOffice, this seperates cells with a tab</li>
 *   <li>change the birth date ending with 1963 into 63, to keep the same format in all rows</li>
 *   <li>run the generator class</li>
 * </ul>
 *
 * @author JB Nizet
 */
public class PersonSqlGenerator {

    private final Stream<String> lines;

    PersonSqlGenerator(Stream<String> lines) {
        this.lines = lines;
    }

    private void generate() {
        List<Row> rows = lines.map(this::toRow).collect(Collectors.toList());

        Map<Character, Integer> maxNumberByCharacter = new HashMap<>();

        Set<String> mediationCodes = new HashSet<>();

        for (Row row : rows) {
            if (row.getMediationCode() != null) {
                maxNumberByCharacter.merge(row.getMediationLetter(), row.getMediationNumber(), Math::max);
            }

            System.out.println(toSqlInsert(row));

            if (row.getMediationCode() != null) {
                boolean added = mediationCodes.add(row.getMediationCode());
                if (!added) {
                    System.out.println(row.getLastName() + " has a duplicate mediation code");
                }
            };
        }
        System.out.println();
        maxNumberByCharacter.forEach((character, number) -> {
            System.out.println(toSequenceUpdate(character, number));
        });
    }

    private String toSequenceUpdate(Character character, Integer number) {
        return "select setval('mediation_code_" + character + "_seq', " + number + ");";
    }

    private String toSqlInsert(Row row) {
        StringBuilder builder = new StringBuilder();
        builder.append(
            "insert into person (id, first_name, last_name, gender, birth_date, phone_number, adherent, mediation_code, " +
                                 "marital_status, housing, fiscal_status, fiscal_status_up_to_date, mediation_enabled, " +
                                 "health_care_coverage) VALUES (nextval('person_seq'), '");
        builder.append(row.getFirstName());
        builder.append("', '");
        builder.append(row.getLastName());
        builder.append("', 'OTHER', ");
        if (row.getBirthDate() == null) {
            builder.append("NULL");
        }
        else {
            builder.append("'");
            builder.append(row.getBirthDate());
            builder.append("'");
        }
        builder.append(", ");
        if (row.getPhone() == null) {
            builder.append("NULL");
        }
        else {
            builder.append("'");
            builder.append(row.getPhone());
            builder.append("'");
        }
        builder.append(", TRUE, ");
        if (row.getMediationCode() == null) {
            builder.append("NULL");
        }
        else {
            builder.append("'");
            builder.append(row.getMediationCode());
            builder.append("'");
        }
        builder.append(", 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', FALSE, ");
        builder.append(row.getMediationCode() == null ? "FALSE" : "TRUE");
        builder.append(", 'UNKNOWN');");

        return builder.toString();
    }

    private Row toRow(String line) {
        String[] array = line.split(Pattern.quote("\t"));

        String mediationCode = null;
        if (array.length > 2 && !Strings.isNullOrEmpty(array[2])) {
            mediationCode = array[2].trim();
        }

        String phone = null;
        if (array.length > 3 && !Strings.isNullOrEmpty(array[3])) {
            phone = array[3].trim();
        }

        LocalDate birthDate = null;
        if (array.length > 4 && !Strings.isNullOrEmpty(array[4])) {
            DateTimeFormatter dateTimeFormatter = new DateTimeFormatterBuilder().appendPattern("dd/MM/")
                                                                                .appendValueReduced(ChronoField.YEAR,
                                                                                                    2,
                                                                                                    2,
                                                                                                    1900)
                                                                                .toFormatter();

            birthDate = LocalDate.parse(array[4].trim(), dateTimeFormatter);
        }

        return new Row(toName(array[0]),
                       toName(array[1]),
                       mediationCode,
                       phone,
                       birthDate);
    }

    private String toName(String s) {
        String result = s.trim().toLowerCase();
        result = Character.toUpperCase(result.charAt(0)) + result.substring(1);
        int dashIndex = result.indexOf('-');
        if (dashIndex >= 0) {
            result = result.substring(0, dashIndex + 1)
                + Character.toUpperCase(result.charAt(dashIndex + 1))
                + result.substring(dashIndex + 2);
        }
        return result;
    }

    public static void main(String[] args) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(PersonSqlGenerator.class.getResourceAsStream(
            "/persons.txt")));
             Stream<String> lines = reader.lines()) {
            PersonSqlGenerator gen = new PersonSqlGenerator(lines);
            gen.generate();
        }
    }

    private static class Row {
        private String lastName;
        private String firstName;
        private String mediationCode;
        private String phone;
        private LocalDate birthDate;

        public Row(String lastName, String firstName, String mediationCode, String phone, LocalDate birthDate) {
            this.lastName = lastName;
            this.firstName = firstName;
            this.mediationCode = mediationCode;
            this.phone = phone;
            this.birthDate = birthDate;
        }

        public String getLastName() {
            return lastName;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getMediationCode() {
            return mediationCode;
        }

        public String getPhone() {
            return phone;
        }

        public LocalDate getBirthDate() {
            return birthDate;
        }

        public Character getMediationLetter() {
            if (mediationCode == null) {
                return null;
            }
            return mediationCode.charAt(0);
        }

        public Integer getMediationNumber() {
            if (mediationCode == null) {
                return null;
            }

            String suffix = mediationCode.substring(1);
            if (suffix.endsWith("a")) {
                suffix = suffix.substring(0, suffix.length() - 1);
            }
            return Integer.valueOf(suffix);
        }
    }
}
