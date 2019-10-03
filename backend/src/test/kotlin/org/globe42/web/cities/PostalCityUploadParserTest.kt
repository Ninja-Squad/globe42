package org.globe42.web.cities

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.nio.charset.StandardCharsets

/**
 * Unit tests for [PostalCityUploadParser]
 * @author JB Nizet
 */
class PostalCityUploadParserTest {
    @Test
    fun `should parse and remove duplicates`() {
        // language=TEXT
        val csv = "Code_commune_INSEE;Nom_commune;Code_postal;Libelle_acheminement;Ligne_5;coordonnees_gps\n" +
                "10227;MAROLLES SOUS LIGNIERES;10130;No no no;;48.0520003827, 3.93246550297\n" +
                "10166;LES GRANDES CHAPELLES;10170;LES GRANDES CHAPELLES;;48.4916267047, 3.93350100384\n" +
                "10232;MERREY SUR ARCE;10110;MERREY SUR ARCE;;48.1160220302, 4.43093259336\n" +
                "10182;JUVANCOURT;10310;JUVANCOURT;;48.1567685845, 4.79470021531\n" +
                "10190;LAUBRESSEL;10270;LAUBRESSEL;;48.2596266125, 4.24959642717\n" +
                "10173;ISLE AUMONT;10800;ISLE AUMONT;;48.2055801821, 4.1125140322\n" +
                "10196;LIGNIERES;10130;LIGNIERES;;48.0520003827, 3.93246550297\n" +
                "10197;LIGNIERES;10130;LIGNIERES;OLD NAME;48.0520003827, 3.93246550297"

        val result = PostalCityUploadParser().parse(csv.toByteArray(StandardCharsets.UTF_8))
        assertThat(result).hasSize(7)
        assertThat(result[0].postalCode).isEqualTo("10130")
        assertThat(result[0].city).isEqualTo("MAROLLES SOUS LIGNIERES")
    }
}
