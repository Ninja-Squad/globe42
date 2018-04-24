package org.globe42.web.cities;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.globe42.domain.PostalCity;
import org.springframework.stereotype.Component;

/**
 * Parser for the CSV file containing postal codes and cities, available at
 * https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/
 * @author JB Nizet
 */
@Component
public class PostalCityUploadParser {

    public List<PostalCity> parse(byte[] content) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(new ByteArrayInputStream(content),
                                                                         StandardCharsets.UTF_8));
        return reader.lines()
                     .skip(1L)
                     .filter(line -> !line.isEmpty())
                     .map(this::parseLine)
                     .distinct()
                     .map(Line::getPostalCity)
                     .collect(Collectors.toList());
    }

    private Line parseLine(String line) {
        String[] split = line.split(";");
        return new Line(new PostalCity(split[2], split[1]));
    }

    /**
     * Wrapper class allowing to remove duplicates, i.e. lines that have the same postal code and city
     */
    private static final class Line {
        private final PostalCity postalCity;

        public Line(PostalCity postalCity) {
            this.postalCity = postalCity;
        }

        public PostalCity getPostalCity() {
            return postalCity;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            Line line = (Line) o;
            return Objects.equals(this.postalCity.getPostalCode(), line.postalCity.getPostalCode())
                   && Objects.equals(this.postalCity.getCity(), line.postalCity.getCity());
        }

        @Override
        public int hashCode() {
            return Objects.hash(postalCity.getPostalCode(), postalCity.getCity());
        }
    }
}
