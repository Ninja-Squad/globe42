package org.globe42.web.cities

import org.globe42.domain.PostalCity
import org.springframework.stereotype.Component
import java.io.BufferedReader
import java.io.ByteArrayInputStream
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets
import java.util.*
import java.util.stream.Collectors

/**
 * Parser for the CSV file containing postal codes and cities, available at
 * https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/
 * @author JB Nizet
 */
@Component
class PostalCityUploadParser {

    fun parse(content: ByteArray): List<PostalCity> {
        val reader = BufferedReader(
            InputStreamReader(
                ByteArrayInputStream(content),
                StandardCharsets.UTF_8
            )
        )
        return reader.lines()
            .skip(1L)
            .filter { line -> !line.isEmpty() }
            .map(this::parseLine)
            .distinct()
            .map(Line::postalCity)
            .collect(Collectors.toList())
    }

    private fun parseLine(line: String): Line {
        val split = line.split(";").dropLastWhile(String::isEmpty).toTypedArray()
        return Line(PostalCity(split[2], split[1]))
    }

    /**
     * Wrapper class allowing to remove duplicates, i.e. lines that have the same postal code and city
     */
    private class Line(val postalCity: PostalCity) {

        override fun equals(other: Any?): Boolean {
            if (this === other) {
                return true
            }
            if (other == null || javaClass != other.javaClass) {
                return false
            }
            val line = other as Line?
            return this.postalCity.postalCode == line!!.postalCity.postalCode && this.postalCity.city == line.postalCity.city
        }

        override fun hashCode(): Int {
            return Objects.hash(postalCity.postalCode, postalCity.city)
        }
    }
}
