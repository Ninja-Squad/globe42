package org.globe42.web.cities

import org.globe42.dao.PostalCityDao
import org.globe42.domain.PostalCity
import org.globe42.web.persons.CityDTO
import org.globe42.web.security.AdminOnly
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

const val LIMIT = 10

/**
 * Controller used to search for postal cities, and to import them.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/cities"])
@Transactional
class PostalCityController(private val postalCityDao: PostalCityDao, private val uploadParser: PostalCityUploadParser) {

    @GetMapping(params = ["query"])
    fun search(@RequestParam("query") query: String): List<CityDTO> {
        val cities: List<PostalCity> =
            if (query.isNumeric()) postalCityDao.findByPostalCode(query, LIMIT)
            else postalCityDao.findByCity(query, LIMIT)

        return cities.map(::CityDTO)
    }

    /**
     * Uploads a file, parses it, removes all the data in the postal_city table, and inserts all the cities
     * contained in the file.
     *
     * You can use the following command line to upload a file and invoke this method:
     * <pre curl -X POST -H></pre> "Authorization: Bearer $your-admin-token" $url/api/cities/uploads -T ~/Downloads/laposte_hexasmal.csv
     *
     */
    @PostMapping("/uploads")
    @AdminOnly
    @ResponseStatus(HttpStatus.CREATED)
    fun upload(@RequestBody data: ByteArray) {
        val cities = uploadParser.parse(data)

        postalCityDao.deleteAll()
        postalCityDao.saveAllEfficiently(cities)
    }

    private fun String.isNumeric(): Boolean = all { c -> c in '0'..'9' }
}
